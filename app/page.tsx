'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatThread, type ChatMessageType } from '@/components/ChatThread';
import { ApiPanel } from '@/components/ApiPanel';
import { CtLogo } from '@/components/CtLogo';
import type { ApiLogEntry } from '@/components/ApiEntry';
import type { DemoProduct } from '@/lib/seed-products';
import type { AddressData } from '@/components/AddressForm';

// ---------------------------------------------------------------------------
// Agent dialogue script
// ---------------------------------------------------------------------------
const SCRIPT = {
  intro: "Hi! I'm your AI shopping assistant. Here are some products I found for you — tap one to learn more.",
  productSelected: (name: string) =>
    `Great choice! **${name}** looks perfect. I can help you purchase this right now. Ready to proceed?`,
  buyPrompt: 'Just click the Buy button below whenever you\'re ready!',
  addressRequest: "I'll need your shipping details to complete the order. Please fill in the form below.",
  creatingSession: "Let me set up your checkout session...",
  sessionCreated: (id: string) =>
    `Your checkout session has been created (ID: ${id.slice(0, 8)}...). Now I'll process your payment.`,
  completing: 'Processing your payment with Stripe...',
  confirmed: 'Your order is confirmed! Thank you for shopping with us.',
  errorSession: (msg: string) => `Something went wrong creating your session: ${msg}. Please try again.`,
  errorComplete: (msg: string) => `Payment processing failed: ${msg}. Please try resetting and trying again.`,
  noToken: "I can't process payment right now — the Stripe payment token isn't ready. Please check the setup.",
};

// ---------------------------------------------------------------------------
// Flow states
// ---------------------------------------------------------------------------
type FlowState =
  | 'LOADING'
  | 'BROWSING'
  | 'PRODUCT_SELECTED'
  | 'COLLECTING_ADDRESS'
  | 'CREATING_SESSION'
  | 'COMPLETING'
  | 'CONFIRMED'
  | 'ERROR';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
let msgId = 0;
function nextId() { return String(++msgId); }

function agentMsg(content: string, typing = true): ChatMessageType {
  return { id: nextId(), role: 'agent', content, typing };
}
function userMsg(content: string): ChatMessageType {
  return { id: nextId(), role: 'user', content };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function DemoPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [apiLog, setApiLog] = useState<ApiLogEntry[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [flowState, setFlowState] = useState<FlowState>('LOADING');
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [tokenStatus, setTokenStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [formActive, setFormActive] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  const addMsg = useCallback((msg: ChatMessageType) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const addApiEntry = useCallback((entry: ApiLogEntry) => {
    setApiLog((prev) => [...prev, entry]);
  }, []);

  // -----------------------------------------------------------------------
  // Load products and initialise Stripe token on mount
  // -----------------------------------------------------------------------
  useEffect(() => {
    async function init() {
      // Kick off Stripe token generation (fire-and-forget, show status)
      fetch('/api/stripe/token')
        .then((r) => r.json())
        .then((d) => setTokenStatus(d.ready ? 'ready' : 'unavailable'))
        .catch(() => setTokenStatus('unavailable'));

      // Fetch products
      try {
        const res = await fetch('/api/products');
        const { products } = await res.json();
        const productsMsg: ChatMessageType = { id: nextId(), role: 'products', products };
        setMessages([agentMsg(SCRIPT.intro, false), productsMsg]);
        setFlowState('BROWSING');
      } catch {
        setMessages([agentMsg('Failed to load products. Please refresh the page.', false)]);
        setFlowState('ERROR');
      }
    }
    init();
  }, []);

  // -----------------------------------------------------------------------
  // Product selected
  // -----------------------------------------------------------------------
  const handleProductSelect = useCallback((product: DemoProduct) => {
    if (flowState !== 'BROWSING') return;
    setSelectedProduct(product);
    setFlowState('PRODUCT_SELECTED');
    addMsg(userMsg(`I'd like to buy: ${product.name}`));
    addMsg(agentMsg(SCRIPT.productSelected(product.name).replace(/\*\*/g, '')));
  }, [flowState, addMsg]);

  // -----------------------------------------------------------------------
  // Buy clicked
  // -----------------------------------------------------------------------
  const handleBuy = useCallback(() => {
    if (flowState !== 'PRODUCT_SELECTED') return;
    setFlowState('COLLECTING_ADDRESS');
    addMsg(userMsg('Buy now'));
    addMsg(agentMsg(SCRIPT.addressRequest));
    setTimeout(() => {
      const formMsg: ChatMessageType = { id: nextId(), role: 'address-form' };
      setMessages((prev) => [...prev, formMsg]);
      setFormActive(true);
    }, 600);
  }, [flowState, addMsg]);

  // -----------------------------------------------------------------------
  // Address submitted → create ACP session
  // -----------------------------------------------------------------------
  const handleAddressSubmit = useCallback(async (data: AddressData) => {
    if (!selectedProduct) return;
    setFormActive(false);
    setAddressData(data);
    setFlowState('CREATING_SESSION');

    addMsg(userMsg(`${data.firstName} ${data.lastName}, ${data.lineOne}, ${data.city}`));
    addMsg(agentMsg(SCRIPT.creatingSession));

    const reqBody = {
      buyer: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phone,
      },
      items: [{ id: selectedProduct.sku ?? selectedProduct.id, quantity: 1 }],
      fulfillmentAddress: {
        name: `${data.firstName} ${data.lastName}`,
        line_one: data.lineOne,
        line_two: data.lineTwo,
        city: data.city,
        country: data.country,
        postal_code: data.postalCode,
      },
    };

    try {
      const res = await fetch('/api/acp/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
      });
      const json = await res.json();

      if (json.apiEntry) addApiEntry(json.apiEntry as ApiLogEntry);

      if (!res.ok || !json.sessionId) {
        addMsg(agentMsg(SCRIPT.errorSession(json.error ?? 'Unknown error')));
        setFlowState('ERROR');
        return;
      }

      sessionIdRef.current = json.sessionId;
      setSessionId(json.sessionId);
      addMsg(agentMsg(SCRIPT.sessionCreated(json.sessionId)));

      // Auto-proceed to complete after a short delay
      setTimeout(() => completeSession(json.sessionId, data), 1500);
    } catch (err) {
      addMsg(agentMsg(SCRIPT.errorSession(String(err))));
      setFlowState('ERROR');
    }
  }, [selectedProduct, addMsg, addApiEntry]); // eslint-disable-line react-hooks/exhaustive-deps

  // -----------------------------------------------------------------------
  // Complete checkout session
  // -----------------------------------------------------------------------
  const completeSession = useCallback(async (sid: string, data: AddressData) => {
    setFlowState('COMPLETING');
    addMsg(agentMsg(SCRIPT.completing));

    const reqBody = {
      buyer: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phone,
      },
      billingAddress: {
        name: `${data.firstName} ${data.lastName}`,
        line_one: data.lineOne,
        line_two: data.lineTwo,
        city: data.city,
        country: data.country,
        postal_code: data.postalCode,
      },
    };

    try {
      const res = await fetch(`/api/acp/sessions/${sid}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
      });
      const json = await res.json();

      if (json.apiEntry) addApiEntry(json.apiEntry as ApiLogEntry);

      if (!res.ok) {
        addMsg(agentMsg(SCRIPT.errorComplete(json.error ?? 'Unknown error')));
        setFlowState('ERROR');
        return;
      }

      addMsg(agentMsg(SCRIPT.confirmed));
      const confirmMsg: ChatMessageType = {
        id: nextId(),
        role: 'confirmation',
        sessionId: sid,
        productName: selectedProduct?.name ?? 'your item',
      };
      setMessages((prev) => [...prev, confirmMsg]);
      setFlowState('CONFIRMED');
    } catch (err) {
      addMsg(agentMsg(SCRIPT.errorComplete(String(err))));
      setFlowState('ERROR');
    }
  }, [addMsg, addApiEntry, selectedProduct]);

  // -----------------------------------------------------------------------
  // Reset demo
  // -----------------------------------------------------------------------
  const handleReset = useCallback(async () => {
    // Cancel active session silently
    const sid = sessionIdRef.current;
    if (sid) {
      fetch(`/api/acp/sessions/${sid}/cancel`, { method: 'POST' })
        .then((r) => r.json())
        .then((d) => { if (d.apiEntry) addApiEntry(d.apiEntry as ApiLogEntry); })
        .catch(() => {});
      sessionIdRef.current = null;
    }

    setFlowState('LOADING');
    setSelectedProduct(null);
    setSessionId(null);
    setAddressData(null);
    setFormActive(false);
    setMessages([]);
    setApiLog([]);

    try {
      const res = await fetch('/api/products');
      const { products } = await res.json();
      const productsMsg: ChatMessageType = { id: nextId(), role: 'products', products };
      setMessages([agentMsg(SCRIPT.intro, false), productsMsg]);
      setFlowState('BROWSING');
    } catch {
      setMessages([agentMsg('Failed to reload products. Please refresh the page.', false)]);
      setFlowState('ERROR');
    }
  }, [addApiEntry]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  const showBuyButton = flowState === 'PRODUCT_SELECTED';
  const isBusy = ['CREATING_SESSION', 'COMPLETING', 'LOADING'].includes(flowState);

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 h-12 border-b border-gray-800 bg-gray-900 flex-shrink-0">
        <CtLogo size={28} />
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-semibold text-white">ACP Checkout Demo</span>
          <span className="text-[10px] text-gray-500 font-mono">powered by commercetools</span>
        </div>
        <div className="flex-1" />

        {/* Token status */}
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              tokenStatus === 'ready'
                ? 'bg-[#FFC82B]'
                : tokenStatus === 'unavailable'
                  ? 'bg-red-400'
                  : 'bg-gray-400 animate-pulse'
            }`}
          />
          <span className="text-gray-400">
            {tokenStatus === 'ready' ? 'Payment ready' : tokenStatus === 'unavailable' ? 'Payment unavailable' : 'Preparing...'}
          </span>
        </div>

        {/* Session ID */}
        {sessionId && (
          <span className="text-[10px] text-gray-600 font-mono hidden sm:block">
            Session: {sessionId.slice(0, 8)}…
          </span>
        )}

        {/* Reset */}
        <button
          onClick={handleReset}
          disabled={isBusy}
          className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-40"
        >
          ↺ Reset
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat column */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <ChatThread
            messages={messages}
            onProductSelect={handleProductSelect}
            onAddressSubmit={handleAddressSubmit}
            formActive={formActive}
          />

          {/* Buy button */}
          {showBuyButton && (
            <div className="px-4 py-3 border-t border-gray-800 flex-shrink-0">
              <button
                onClick={handleBuy}
                className="bg-[#FFC82B] hover:bg-yellow-300 text-[#1a1a1a] font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
              >
                🛒 Buy now
              </button>
            </div>
          )}

          {/* Loading/busy indicator */}
          {isBusy && flowState !== 'BROWSING' && (
            <div className="px-4 py-2 flex-shrink-0">
              <span className="text-xs text-gray-500 animate-pulse">
                {flowState === 'LOADING' ? 'Loading products…' : flowState === 'CREATING_SESSION' ? 'Creating session…' : 'Processing…'}
              </span>
            </div>
          )}
        </div>

        {/* API panel */}
        <ApiPanel
          open={panelOpen}
          onToggle={() => setPanelOpen((o) => !o)}
          entries={apiLog}
        />
      </div>
    </div>
  );
}

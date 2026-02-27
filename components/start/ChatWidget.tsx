"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Send, Phone, CheckCircle, Loader2, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/apiClient";
import { cn } from "@/lib/utils";

type ChatStep = "message" | "contact" | "submitting" | "success";

const ChatWidget: React.FC = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ChatStep>("message");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const messageInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);

  // Focus input when panel opens or step changes
  useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(() => {
      if (step === "message") {
        messageInputRef.current?.focus();
      } else if (step === "contact") {
        nameInputRef.current?.focus();
      }
    }, 350); // After animation
    return () => clearTimeout(timeout);
  }, [isOpen, step]);

  // Mobile: Lock body scroll when chat is open to prevent viewport issues
  useEffect(() => {
    if (!isOpen) return;
    const isMobile = window.innerWidth < 640;
    if (!isMobile) return;

    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // iOS: Adjust chat panel height when virtual keyboard opens/closes
  useEffect(() => {
    if (!isOpen) return;
    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      const panel = chatPanelRef.current;
      if (!panel) return;
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        panel.style.height = `${vv.height * 0.85}px`;
      }
    };

    vv.addEventListener("resize", handleResize);
    return () => vv.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset panel height override
    if (chatPanelRef.current) {
      chatPanelRef.current.style.height = "";
    }
    // Reset after close animation
    setTimeout(() => {
      setStep("message");
      setMessage("");
      setName("");
      setEmail("");
    }, 300);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setStep("contact");
  };

  const handleMessageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSubmitContact = async () => {
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte geben Sie Ihren Namen und Ihre E-Mail-Adresse ein.",
        variant: "destructive",
      });
      return;
    }

    setStep("submitting");

    try {
      const response = await apiClient.sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      if (response.success) {
        setStep("success");
        setTimeout(() => {
          setIsOpen(false);
          setTimeout(() => {
            setStep("message");
            setMessage("");
            setName("");
            setEmail("");
          }, 300);
        }, 4000);
      } else {
        setStep("contact");
        toast({
          title: "Fehler beim Senden",
          description: response.error || "Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
      }
    } catch {
      setStep("contact");
      toast({
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  const handleContactKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && name.trim() && email.trim()) {
      e.preventDefault();
      handleSubmitContact();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[39] sm:hidden"
          onClick={handleClose}
        />
      )}

      {/* Trigger Button - Icon-only FAB on mobile, full pill on desktop */}
      <button
        onClick={handleOpen}
        aria-label="Chat öffnen"
        className={cn(
          "fixed z-40 flex items-center justify-center",
          "bg-accent-200 hover:bg-accent-300 text-white",
          // Mobile: compact circle FAB
          "w-14 h-14 rounded-full shadow-strong",
          "bottom-4 right-4",
          // Desktop: full pill with text
          "sm:w-auto sm:h-auto sm:px-8 sm:py-5 sm:gap-2.5",
          "sm:bottom-6 sm:right-6",
          "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "hover:scale-105",
          isOpen
            ? "opacity-0 scale-90 pointer-events-none"
            : "opacity-100 scale-100 pointer-events-auto"
        )}
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        <span className="hidden sm:inline font-semibold text-lg whitespace-nowrap">Jetzt beraten lassen</span>
        <Image
          src="/logo-final.png"
          alt="Bauklar"
          width={32}
          height={32}
          className="hidden sm:block w-8 h-8 rounded-sm"
        />
      </button>

      {/* Chat Panel */}
      <div
        ref={chatPanelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Chat mit Bauklar"
        className={cn(
          "fixed z-40 flex flex-col bg-white shadow-strong border border-primary-200",
          "overflow-hidden overflow-x-hidden",
          "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          // Mobile: full-width bottom sheet with dvh for iOS keyboard safety
          "inset-x-0 bottom-0 w-full max-h-[85dvh] rounded-t-2xl",
          // Desktop: floating panel
          "sm:inset-x-auto sm:bottom-6 sm:right-6 sm:left-auto sm:w-[480px] sm:max-h-[640px] sm:rounded-2xl",
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-accent-200 text-white flex-shrink-0">
          <Image
            src="/logo-final.png"
            alt="Bauklar"
            width={28}
            height={28}
            className="w-7 h-7 rounded-sm"
          />
          <span className="font-semibold text-sm flex-1">Bauklar.org</span>
          <button
            onClick={handleClose}
            aria-label="Chat schließen"
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-bg-200">
          {/* Welcome bubble (always shown) */}
          <div className="bg-white rounded-xl rounded-tl-sm p-4 shadow-soft max-w-[85%]">
            <p className="text-sm text-text-200">
              Willkommen bei Bauklar! Wir helfen Ihnen gerne bei jeglichen Fragen!
            </p>
          </div>

          {/* Message Step */}
          {step === "message" && (
            <div className="text-xs text-text-300 text-center">
              Schreiben Sie uns Ihre Frage
            </div>
          )}

          {/* Contact Step - show user message + contact form */}
          {step === "contact" && (
            <>
              {/* User message bubble */}
              <div className="ml-auto bg-accent-200 text-white rounded-xl rounded-tr-sm p-3 max-w-[85%]">
                <p className="text-sm">{message}</p>
              </div>

              {/* Bot response with form */}
              <div className="bg-white rounded-xl rounded-tl-sm p-4 shadow-soft max-w-[90%]">
                <p className="text-sm text-text-200 mb-3">
                  Vielen Dank! Damit wir Ihnen antworten können, benötigen wir noch:
                </p>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="chat-name" className="text-xs">Name *</Label>
                    <Input
                      ref={nameInputRef}
                      id="chat-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={handleContactKeyDown}
                      placeholder="Ihr Name"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="chat-email" className="text-xs">E-Mail *</Label>
                    <Input
                      id="chat-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleContactKeyDown}
                      placeholder="ihre@email.de"
                      className="h-9 text-sm"
                    />
                  </div>
                  <Button
                    onClick={handleSubmitContact}
                    className="w-full bg-accent-200 hover:bg-accent-300 text-white text-sm h-9"
                  >
                    Absenden
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Submitting Step */}
          {step === "submitting" && (
            <>
              <div className="ml-auto bg-accent-200 text-white rounded-xl rounded-tr-sm p-3 max-w-[85%]">
                <p className="text-sm">{message}</p>
              </div>
              <div className="bg-white rounded-xl rounded-tl-sm p-4 shadow-soft max-w-[85%] flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-accent-200 animate-spin" />
                <p className="text-sm text-text-300">Wird gesendet...</p>
              </div>
            </>
          )}

          {/* Success Step */}
          {step === "success" && (
            <>
              <div className="ml-auto bg-accent-200 text-white rounded-xl rounded-tr-sm p-3 max-w-[85%]">
                <p className="text-sm">{message}</p>
              </div>
              <div className="bg-white rounded-xl rounded-tl-sm p-4 shadow-soft max-w-[85%] text-center">
                <CheckCircle className="w-10 h-10 text-success-100 mx-auto mb-2" />
                <p className="font-semibold text-text-100 text-sm">Nachricht gesendet!</p>
                <p className="text-xs text-text-300 mt-1">
                  Wir melden uns innerhalb von 24 Stunden.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Input area (message step only) */}
        {step === "message" && (
          <div className="flex items-center gap-2 px-4 py-3 border-t border-primary-200 bg-white flex-shrink-0">
            <Input
              ref={messageInputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleMessageKeyDown}
              placeholder="Nachricht eingeben..."
              className="flex-1 h-9 text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              aria-label="Nachricht senden"
              className={cn(
                "p-2 rounded-full transition-colors",
                message.trim()
                  ? "text-accent-200 hover:bg-accent-200/10"
                  : "text-text-300 cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Bottom call bar */}
        <div className="px-5 py-3 border-t border-primary-200 bg-white flex-shrink-0">
          <a
            href="tel:+4932221804909"
            className="flex items-center justify-center gap-2 text-accent-200 hover:text-accent-300 font-medium text-sm transition-all duration-200"
          >
            <Phone className="w-4 h-4" />
            <span>+49 322 21804909</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;

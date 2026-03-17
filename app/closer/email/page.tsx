'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getMailAccounts,
  getMailFolders,
  getMailMessages,
  getMailMessage,
  sendMail,
  searchMail,
  getEmailHistory,
  type MailAccount,
  type MailFolder,
  type MailMessage,
  type MailMessageContent,
  type EmailLogEntry,
} from '@/lib/zoho-api';

// ── Compose Modal ──────────────────────────────────────────────────

interface ComposeProps {
  account: MailAccount | null;
  replyTo?: MailMessageContent | null;
  onClose: () => void;
  onSent: () => void;
}

function ComposeModal({ account, replyTo, onClose, onSent }: ComposeProps) {
  const [to, setTo] = useState(replyTo ? replyTo.from : '');
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [body, setBody] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!account || !to.trim() || !subject.trim()) return;
    setSending(true);
    setError(null);
    try {
      await sendMail({
        accountId: account.accountId,
        fromAddress: account.emailAddress,
        toAddress: to.trim(),
        subject: subject.trim(),
        content: body,
        ccAddress: cc.trim() || undefined,
        bccAddress: bcc.trim() || undefined,
        mailFormat: 'html',
        inReplyTo: replyTo?.messageId,
      });
      onSent();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="rounded-2xl border" style={{ width: 640, maxHeight: '80vh', backgroundColor: 'var(--ept-card-bg)', borderColor: 'var(--ept-card-border)', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--ept-border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>{replyTo ? 'Reply' : 'New Email'}</h3>
          <button onClick={onClose} style={{ color: 'var(--ept-text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>From</label>
            <div className="text-sm px-3 py-2 rounded-lg border" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text-secondary)' }}>{account?.emailAddress || 'No account'}</div>
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>To</label>
            <input value={to} onChange={e => setTo(e.target.value)} className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }} placeholder="recipient@example.com" />
          </div>
          {!showCcBcc && (
            <button onClick={() => setShowCcBcc(true)} className="text-[11px] font-medium" style={{ color: 'var(--ept-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>+ CC / BCC</button>
          )}
          {showCcBcc && (
            <>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>CC</label>
                <input value={cc} onChange={e => setCc(e.target.value)} className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }} />
              </div>
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>BCC</label>
                <input value={bcc} onChange={e => setBcc(e.target.value)} className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }} />
              </div>
            </>
          )}
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }} placeholder="Subject" />
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'var(--ept-text-muted)' }}>Message</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={10} className="w-full text-sm px-3 py-2 rounded-xl border outline-none resize-y" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)', fontFamily: 'inherit', lineHeight: 1.7 }} placeholder="Compose your email..." />
          </div>
          {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-3 border-t" style={{ borderColor: 'var(--ept-border)' }}>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)', backgroundColor: 'transparent', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSend} disabled={sending || !to.trim() || !subject.trim()} className="px-5 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', cursor: sending ? 'wait' : 'pointer', opacity: sending || !to.trim() || !subject.trim() ? 0.5 : 1, border: 'none' }}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Message Viewer ─────────────────────────────────────────────────

function MessageViewer({ message, onReply, onBack }: { message: MailMessageContent; onReply: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'var(--ept-border)' }}>
        <button onClick={onBack} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-secondary)', backgroundColor: 'transparent', cursor: 'pointer' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <button onClick={onReply} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', border: 'none', cursor: 'pointer' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10l7-7m0 0l7 7m-7-7v18" /></svg>
          Reply
        </button>
      </div>
      <div className="py-4">
        <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--ept-text)' }}>{message.subject}</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs mb-4" style={{ color: 'var(--ept-text-muted)' }}>
          <span><strong style={{ color: 'var(--ept-text-secondary)' }}>From:</strong> {message.from}</span>
          <span><strong style={{ color: 'var(--ept-text-secondary)' }}>To:</strong> {message.to}</span>
          {message.cc && <span><strong style={{ color: 'var(--ept-text-secondary)' }}>CC:</strong> {message.cc}</span>}
          <span>{new Date(Number(message.sentDateInGMT) || message.sentDateInGMT).toLocaleString()}</span>
        </div>
        {message.hasAttachment && message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {message.attachments.map(a => (
              <span key={a.attachmentId} className="text-[10px] px-2 py-1 rounded-lg border" style={{ borderColor: 'var(--ept-border)', color: 'var(--ept-text-muted)' }}>
                {a.attachmentName} ({(a.size / 1024).toFixed(0)}KB)
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto rounded-xl border p-4" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
        {message.htmlContent ? (
          <div className="prose prose-sm max-w-none" style={{ color: 'var(--ept-text)' }} dangerouslySetInnerHTML={{ __html: message.htmlContent }} />
        ) : (
          <pre className="whitespace-pre-wrap text-sm" style={{ color: 'var(--ept-text)', fontFamily: 'inherit' }}>{message.content}</pre>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────

export default function CloserEmailPage() {
  const [accounts, setAccounts] = useState<MailAccount[]>([]);
  const [activeAccount, setActiveAccount] = useState<MailAccount | null>(null);
  const [folders, setFolders] = useState<MailFolder[]>([]);
  const [activeFolder, setActiveFolder] = useState<MailFolder | null>(null);
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MailMessageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [replyTo, setReplyTo] = useState<MailMessageContent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MailMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sentHistory, setSentHistory] = useState<EmailLogEntry[]>([]);
  const [showSentHistory, setShowSentHistory] = useState(false);

  // Load accounts on mount
  useEffect(() => {
    (async () => {
      try {
        const accts = await getMailAccounts();
        setAccounts(accts);
        if (accts.length > 0) {
          setActiveAccount(accts[0]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load mail accounts. Make sure Zoho is connected with mail scopes.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load folders when account changes
  useEffect(() => {
    if (!activeAccount) return;
    (async () => {
      try {
        const f = await getMailFolders(activeAccount.accountId);
        setFolders(f);
        const inbox = f.find(fd => fd.folderName.toLowerCase() === 'inbox') || f[0];
        if (inbox) setActiveFolder(inbox);
      } catch (err: any) {
        setError(err.message || 'Failed to load folders');
      }
    })();
  }, [activeAccount]);

  // Load messages when folder changes
  useEffect(() => {
    if (!activeAccount || !activeFolder) return;
    setLoadingMessages(true);
    setSearchResults(null);
    setSelectedMessage(null);
    (async () => {
      try {
        const msgs = await getMailMessages(activeAccount.accountId, activeFolder.folderId);
        setMessages(msgs);
      } catch (err: any) {
        setError(err.message || 'Failed to load messages');
      } finally {
        setLoadingMessages(false);
      }
    })();
  }, [activeAccount, activeFolder]);

  const openMessage = useCallback(async (msg: MailMessage) => {
    if (!activeAccount) return;
    setLoadingMessage(true);
    try {
      const full = await getMailMessage(activeAccount.accountId, msg.messageId);
      setSelectedMessage(full);
    } catch (err: any) {
      setError(err.message || 'Failed to load message');
    } finally {
      setLoadingMessage(false);
    }
  }, [activeAccount]);

  const handleSearch = useCallback(async () => {
    if (!activeAccount || !searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setLoadingMessages(true);
    try {
      const results = await searchMail(activeAccount.accountId, searchQuery.trim());
      setSearchResults(results);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoadingMessages(false);
    }
  }, [activeAccount, searchQuery]);

  const loadSentHistory = useCallback(async () => {
    try {
      const history = await getEmailHistory();
      setSentHistory(history);
      setShowSentHistory(true);
    } catch { /* ignore */ }
  }, []);

  const refreshMessages = useCallback(async () => {
    if (!activeAccount || !activeFolder) return;
    setLoadingMessages(true);
    try {
      const msgs = await getMailMessages(activeAccount.accountId, activeFolder.folderId);
      setMessages(msgs);
    } catch { /* ignore */ } finally {
      setLoadingMessages(false);
    }
  }, [activeAccount, activeFolder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (error && accounts.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="text-4xl mb-4">&#9993;</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--ept-text)' }}>Mail Not Connected</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--ept-text-muted)' }}>
          {error || 'Connect your Zoho account with mail scopes to access email. Go to Settings > Integrations to reconnect.'}
        </p>
        <a href="/closer/settings" className="px-5 py-2.5 rounded-xl text-sm font-semibold inline-block" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', textDecoration: 'none' }}>
          Go to Settings
        </a>
      </div>
    );
  }

  // If viewing a message
  if (selectedMessage && !loadingMessage) {
    return (
      <div className="h-full">
        <MessageViewer
          message={selectedMessage}
          onReply={() => { setReplyTo(selectedMessage); setShowCompose(true); }}
          onBack={() => setSelectedMessage(null)}
        />
        {showCompose && (
          <ComposeModal
            account={activeAccount}
            replyTo={replyTo}
            onClose={() => { setShowCompose(false); setReplyTo(null); }}
            onSent={refreshMessages}
          />
        )}
      </div>
    );
  }

  const displayMessages = searchResults !== null ? searchResults : messages;

  return (
    <div className="flex gap-4 h-[calc(100vh-140px)]">
      {/* Folder Sidebar */}
      <div className="w-52 shrink-0 flex flex-col gap-1 border-r pr-4" style={{ borderColor: 'var(--ept-border)' }}>
        {accounts.length > 1 && (
          <select
            value={activeAccount?.accountId || ''}
            onChange={e => {
              const acct = accounts.find(a => a.accountId === e.target.value);
              if (acct) setActiveAccount(acct);
            }}
            className="text-xs px-2 py-1.5 rounded-lg border mb-2 w-full outline-none"
            style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)', color: 'var(--ept-text)' }}
          >
            {accounts.map(a => <option key={a.accountId} value={a.accountId}>{a.emailAddress}</option>)}
          </select>
        )}
        {accounts.length === 1 && (
          <div className="text-[10px] font-mono px-2 py-1 mb-2 truncate" style={{ color: 'var(--ept-text-muted)' }}>
            {activeAccount?.emailAddress}
          </div>
        )}
        <button
          onClick={() => { setShowCompose(true); setReplyTo(null); }}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-semibold mb-3"
          style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Compose
        </button>
        {folders.map(f => {
          const isActive = activeFolder?.folderId === f.folderId && !showSentHistory;
          return (
            <button
              key={f.folderId}
              onClick={() => { setActiveFolder(f); setShowSentHistory(false); setSearchResults(null); }}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left w-full"
              style={{
                color: isActive ? 'var(--ept-accent)' : 'var(--ept-text-secondary)',
                backgroundColor: isActive ? 'var(--ept-accent-glow, rgba(20,184,166,0.08))' : 'transparent',
                border: 'none', cursor: 'pointer',
              }}
            >
              <span className="truncate">{f.folderName}</span>
              {f.unreadCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--ept-accent)', color: '#fff', minWidth: 18, textAlign: 'center' }}>
                  {f.unreadCount}
                </span>
              )}
            </button>
          );
        })}
        <div className="my-2" style={{ height: 1, backgroundColor: 'var(--ept-border)' }} />
        <button
          onClick={loadSentHistory}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left w-full"
          style={{
            color: showSentHistory ? 'var(--ept-accent)' : 'var(--ept-text-muted)',
            backgroundColor: showSentHistory ? 'var(--ept-accent-glow, rgba(20,184,166,0.08))' : 'transparent',
            border: 'none', cursor: 'pointer',
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Sent History
        </button>
      </div>

      {/* Message List / Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center rounded-xl border px-3" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)' }}>
            <svg className="w-4 h-4 shrink-0" style={{ color: 'var(--ept-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              placeholder="Search emails..."
              className="w-full text-sm py-2 px-2 bg-transparent outline-none"
              style={{ color: 'var(--ept-text)' }}
            />
            {searchResults !== null && (
              <button onClick={() => { setSearchResults(null); setSearchQuery(''); }} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--ept-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
            )}
          </div>
          <button onClick={refreshMessages} title="Refresh" className="flex items-center justify-center w-9 h-9 rounded-xl border" style={{ borderColor: 'var(--ept-border)', backgroundColor: 'var(--ept-surface)', cursor: 'pointer', color: 'var(--ept-text-muted)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
          </button>
        </div>

        {/* Folder header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--ept-text)' }}>
            {showSentHistory ? 'Sent Email History' : searchResults !== null ? `Search: "${searchQuery}"` : activeFolder?.folderName || 'Inbox'}
          </h2>
          <span className="text-[10px] font-mono" style={{ color: 'var(--ept-text-muted)' }}>
            {showSentHistory ? `${sentHistory.length} emails` : `${displayMessages.length} messages`}
          </span>
        </div>

        {/* Error banner */}
        {error && (
          <div className="text-xs px-3 py-2 rounded-lg mb-2 flex items-center justify-between" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>&times;</button>
          </div>
        )}

        {/* Sent History view */}
        {showSentHistory ? (
          <div className="flex-1 overflow-y-auto space-y-1">
            {sentHistory.length === 0 ? (
              <p className="text-sm py-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>No sent emails logged yet.</p>
            ) : sentHistory.map(entry => (
              <div key={entry.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border cursor-default" style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium truncate" style={{ color: 'var(--ept-text)' }}>To: {entry.to_address}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: entry.status === 'sent' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: entry.status === 'sent' ? '#10b981' : '#ef4444' }}>{entry.status}</span>
                  </div>
                  <p className="text-xs truncate mt-0.5" style={{ color: 'var(--ept-text-secondary)' }}>{entry.subject}</p>
                </div>
                <span className="text-[10px] shrink-0" style={{ color: 'var(--ept-text-muted)' }}>{new Date(entry.sent_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : (
          /* Message list */
          <div className="flex-1 overflow-y-auto space-y-1">
            {loadingMessages ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
              </div>
            ) : displayMessages.length === 0 ? (
              <p className="text-sm py-8 text-center" style={{ color: 'var(--ept-text-muted)' }}>
                {searchResults !== null ? 'No messages match your search.' : 'No messages in this folder.'}
              </p>
            ) : displayMessages.map(msg => {
              const isUnread = msg.status === '0' || msg.status === 'unread';
              return (
                <button
                  key={msg.messageId}
                  onClick={() => openMessage(msg)}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border transition-all hover:opacity-80"
                  style={{ borderColor: 'var(--ept-card-border)', backgroundColor: 'var(--ept-card-bg)', cursor: 'pointer' }}
                >
                  {isUnread && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: 'var(--ept-accent)' }} />}
                  {!isUnread && <span className="w-2 h-2 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs truncate" style={{ color: 'var(--ept-text)', fontWeight: isUnread ? 700 : 400 }}>{msg.sender}</span>
                      <span className="text-[10px] shrink-0" style={{ color: 'var(--ept-text-muted)' }}>
                        {new Date(Number(msg.receivedTime) || msg.receivedTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs truncate" style={{ color: 'var(--ept-text-secondary)', fontWeight: isUnread ? 600 : 400 }}>{msg.subject}</p>
                    <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--ept-text-muted)' }}>{msg.summary}</p>
                  </div>
                  {msg.hasAttachment && (
                    <svg className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--ept-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Loading overlay for message content */}
      {loadingMessage && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ept-accent)', borderTopColor: 'transparent' }} />
        </div>
      )}

      {/* Compose modal */}
      {showCompose && (
        <ComposeModal
          account={activeAccount}
          replyTo={replyTo}
          onClose={() => { setShowCompose(false); setReplyTo(null); }}
          onSent={refreshMessages}
        />
      )}
    </div>
  );
}

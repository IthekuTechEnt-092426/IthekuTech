import { useEffect, useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import type { Session } from '@supabase/supabase-js';
import {
  ArrowDownRight,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CircleHelp,
  FolderKanban,
  LogOut,
  Mail,
  MessageCircle,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { listWebsiteRequests, updateWebsiteRequestStatus } from '@/lib/admin.functions';
import logo from '@/assets/logo.asset.json';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectUpdate = Database['public']['Tables']['project_updates']['Row'];
type ProjectMessage = Database['public']['Tables']['project_messages']['Row'];
type ClientProfile = Database['public']['Tables']['client_profiles']['Row'];
type WebsiteRequest = Database['public']['Tables']['website_requests']['Row'];
type PortalMode = 'client' | 'admin';
type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed';

const projectStatuses = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'review', label: 'In review' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On hold' },
];

const statusNames = Object.fromEntries(projectStatuses.map(({ value, label }) => [value, label]));
const leadStatuses: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'closed', label: 'Closed' },
];
const hasSupabaseConfig = Boolean(
  import.meta.env['VITE_SUPABASE_URL'] && import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'],
);

function displayDate(value: string | null) {
  if (!value) return 'Not set';
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  return new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function statusLabel(status: string) {
  return statusNames[status] ?? status.replaceAll('_', ' ');
}

export function ProjectPortal({ mode }: { mode: PortalMode }) {
  const fetchLeads = useServerFn(listWebsiteRequests);
  const saveLeadStatus = useServerFn(updateWebsiteRequestStatus);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [profiles, setProfiles] = useState<ClientProfile[]>([]);
  const [leads, setLeads] = useState<WebsiteRequest[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState('');
  const [messageDraft, setMessageDraft] = useState('');
  const [messageBusy, setMessageBusy] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [projectBusy, setProjectBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const userId = session?.user.id ?? '';
  const isAdmin = session?.user.app_metadata?.role === 'admin';
  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null;

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setAuthReady(true);
      return;
    }

    let active = true;
    void supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        if (active) setSession(data.session);
      })
      .catch(() => {
        if (active) setAuthError('We could not connect to the account service. Check the Supabase setup and try again.');
      })
      .finally(() => {
        if (active) setAuthReady(true);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      setProjects([]);
      setUpdates([]);
      setProfiles([]);
      setSelectedProjectId('');
      return;
    }

    let active = true;
    setLoading(true);
    setWorkspaceError('');

    const loadWorkspace = async () => {
      const [projectResult, updateResult, profileResult] = await Promise.all([
        supabase.from('projects').select('*').order('updated_at', { ascending: false }),
        supabase.from('project_updates').select('*').order('created_at', { ascending: false }).limit(100),
        isAdmin
          ? supabase.from('client_profiles').select('*').order('created_at', { ascending: false })
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (projectResult.error || updateResult.error || profileResult.error) {
        throw projectResult.error ?? updateResult.error ?? profileResult.error;
      }

      if (!active) return;
      const nextProjects = projectResult.data ?? [];
      setProjects(nextProjects);
      setUpdates(updateResult.data ?? []);
      setProfiles(profileResult.data ?? []);
      setSelectedProjectId((current) => nextProjects.some((project) => project.id === current)
        ? current
        : nextProjects[0]?.id ?? '');
    };

    void loadWorkspace()
      .catch(() => {
        if (active) setWorkspaceError('Your workspace could not be loaded. Confirm the project migration is applied and try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId, isAdmin]);

  useEffect(() => {
    if (!userId || !isAdmin) {
      setLeads([]);
      return;
    }
    let active = true;
    setLeadsLoading(true);
    setLeadError('');
    void fetchLeads()
      .then((data) => {
        if (active) setLeads(data);
      })
      .catch(() => {
        if (active) setLeadError('Lead requests could not be loaded. Confirm the server service-role key is configured.');
      })
      .finally(() => {
        if (active) setLeadsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId, isAdmin, fetchLeads]);

  useEffect(() => {
    if (!selectedProjectId || !userId) {
      setMessages([]);
      return;
    }

    let active = true;
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('project_messages')
        .select('*')
        .eq('project_id', selectedProjectId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      if (active) setMessages(data ?? []);
    };

    void fetchMessages().catch(() => {
      if (active) setMessageError('Messages could not be loaded. Check access to this project.');
    });

    const channel = supabase
      .channel(`project-messages-${selectedProjectId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'project_messages',
        filter: `project_id=eq.${selectedProjectId}`,
      }, () => {
        void fetchMessages().catch(() => undefined);
      })
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [selectedProjectId, userId]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginBusy(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail.trim(), password: loginPassword });
    if (error) setAuthError('We could not sign you in. Check your email and password, or ask the team for access.');
    setLoginBusy(false);
  }

  async function handlePasswordReset() {
    setAuthError('');
    setResetSent(false);
    if (!loginEmail.trim()) {
      setAuthError('Enter your account email first, then request a reset link.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(loginEmail.trim(), {
      redirectTo: `${window.location.origin}${mode === 'admin' ? '/admin-portal' : '/client-portal'}`,
    });
    if (error) setAuthError('A reset link could not be sent. Check your email address and try again.');
    else setResetSent(true);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSession(null);
  }

  async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProject || !messageDraft.trim()) return;
    setMessageBusy(true);
    setMessageError('');
    const { error } = await supabase.from('project_messages').insert({
      project_id: selectedProject.id,
      author_id: userId,
      body: messageDraft.trim(),
    });
    if (error) {
      setMessageError('Your message was not sent. Please try again.');
    } else {
      setMessageDraft('');
      const { data } = await supabase
        .from('project_messages')
        .select('*')
        .eq('project_id', selectedProject.id)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    }
    setMessageBusy(false);
  }

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setProjectBusy(true);
    setWorkspaceError('');
    const { data, error } = await supabase.from('projects').insert({
      client_id: String(formData.get('client_id')),
      name: String(formData.get('name')).trim(),
      service: String(formData.get('service')).trim(),
      summary: String(formData.get('summary')).trim(),
      start_date: String(formData.get('start_date')) || null,
      target_date: String(formData.get('target_date')) || null,
    }).select('*').single();

    if (error) {
      setWorkspaceError('The project could not be created. Confirm the client account and try again.');
    } else {
      setProjects((current) => [data, ...current]);
      setSelectedProjectId(data.id);
      setNotice('Project created. The client can now see it in their workspace.');
    }
    setProjectBusy(false);
  }

  async function handlePostUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProject) return;
    const formData = new FormData(event.currentTarget);
    const progress = Number(formData.get('progress'));
    const status = String(formData.get('status'));
    const title = String(formData.get('title')).trim();
    const body = String(formData.get('body')).trim();
    setProjectBusy(true);
    setWorkspaceError('');

    const { error: projectError } = await supabase
      .from('projects')
      .update({ progress, status })
      .eq('id', selectedProject.id);

    if (projectError) {
      setWorkspaceError('Project progress could not be saved. Please try again.');
      setProjectBusy(false);
      return;
    }

    const { data: update, error: updateError } = await supabase.from('project_updates').insert({
      project_id: selectedProject.id,
      author_id: userId,
      title,
      body,
    }).select('*').single();

    setProjects((current) => current.map((project) => project.id === selectedProject.id
      ? { ...project, progress, status, updated_at: new Date().toISOString() }
      : project));
    if (update) setUpdates((current) => [update, ...current]);
    setNotice(updateError
      ? 'Progress saved, but the update note was not published. Please try the note again.'
      : 'Project progress and client update saved.');
    setProjectBusy(false);
  }

  async function handleLeadStatusChange(id: string, status: LeadStatus) {
    setLeadError('');
    try {
      await saveLeadStatus({ data: { id, status } });
      setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status } : lead));
    } catch {
      setLeadError('Lead status could not be updated. Please try again.');
    }
  }

  if (!authReady) return <div className="portal-loading" aria-label="Loading account"><span /></div>;

  if (!session) {
    return <LoginScreen
      mode={mode}
      email={loginEmail}
      password={loginPassword}
      busy={loginBusy}
      error={authError}
      resetSent={resetSent}
      configured={hasSupabaseConfig}
      onEmail={setLoginEmail}
      onPassword={setLoginPassword}
      onSubmit={handleLogin}
      onReset={handlePasswordReset}
    />;
  }

  if (mode === 'admin' && !isAdmin) {
    return <AccessNotice title="Staff access required" message="This account is not assigned to the iTheku team workspace." onSignOut={handleSignOut} />;
  }

  if (mode === 'client' && isAdmin) {
    return <AccessNotice title="You are signed in as staff" message="Open the project desk to manage client workspaces." onSignOut={handleSignOut} adminLink />;
  }

  const activeCount = projects.filter((project) => project.status !== 'completed').length;
  const selectedUpdates = updates.filter((update) => update.project_id === selectedProject?.id);
  const selectedClient = profiles.find((profile) => profile.user_id === selectedProject?.client_id);

  return <div className={`workspace-shell ${mode === 'admin' ? 'workspace-admin' : 'workspace-client'}`}>
    <aside className="workspace-sidebar">
      <Link to="/" className="workspace-brand" aria-label="iTheku Tech home">
        <img src={logo.url} alt="iTheku Tech-Enterprise" />
        <span><strong>iTheku</strong><small>{mode === 'admin' ? 'PROJECT DESK' : 'CLIENT WORKSPACE'}</small></span>
      </Link>
      <div className="workspace-side-rule" />
      <p className="workspace-side-label">WORKSPACE</p>
      <a className="workspace-nav-active" href="#projects"><FolderKanban />Projects <span>{projects.length}</span></a>
      <a href="#conversation"><MessageCircle />Messages</a>
      {mode === 'admin' && <a href="#leads"><Mail />Leads <span>{leads.filter((lead) => lead.status === 'new').length}</span></a>}
      {mode === 'admin' && <a href="#clients"><UserRound />Clients <span>{profiles.length}</span></a>}
      <div className="workspace-side-bottom">
        <div className="workspace-help"><CircleHelp /><span><strong>Need a hand?</strong><small>Our team is here to help.</small></span><ArrowDownRight size={15} /></div>
        <button type="button" className="workspace-account" onClick={handleSignOut}>
          <span className="account-avatar">{(session.user.email?.[0] ?? 'U').toUpperCase()}</span>
          <span className="account-details"><strong>{session.user.email?.split('@')[0] ?? 'Account'}</strong><small>{session.user.email}</small></span>
          <LogOut aria-label="Sign out" />
        </button>
      </div>
    </aside>

    <main className="workspace-main">
      <header className="workspace-topbar">
        <div className="workspace-breadcrumb"><span>Workspace</span><ArrowRight size={13} /><strong>{mode === 'admin' ? 'Project desk' : 'My projects'}</strong></div>
        <div className="workspace-topbar-user"><span className="workspace-live-dot" />{mode === 'admin' ? 'Team view' : 'Client view'}<button type="button" className="workspace-mobile-signout" onClick={handleSignOut} aria-label="Sign out"><LogOut /></button></div>
      </header>

      <div className="workspace-content">
        <div className="workspace-heading">
          <div>
            <p className="workspace-eyebrow"><Sparkles size={14} />{mode === 'admin' ? 'CLIENT DELIVERY' : 'YOUR PROJECT SPACE'}</p>
            <h1>{mode === 'admin' ? 'Project desk' : 'Your projects'}</h1>
            <p>{mode === 'admin' ? 'A clear view of delivery, client updates and open conversations.' : 'Track progress and stay close to the team building your next step.'}</p>
          </div>
          <div className="workspace-today"><CalendarDays size={16} /><span>{displayDate(new Date().toISOString().slice(0, 10))}</span></div>
        </div>

        <section className="workspace-stats" aria-label="Workspace summary">
          <div><span>{mode === 'admin' ? 'ACTIVE PROJECTS' : 'IN PROGRESS'}</span><strong>{activeCount.toString().padStart(2, '0')}</strong><small>Across your workspace</small></div>
          <div><span>TOTAL PROJECTS</span><strong>{projects.length.toString().padStart(2, '0')}</strong><small>Including completed work</small></div>
          <div><span>{mode === 'admin' ? 'NEW LEADS' : 'CONVERSATIONS'}</span><strong>{(mode === 'admin' ? leads.filter((lead) => lead.status === 'new').length : messages.length).toString().padStart(2, '0')}</strong><small>{mode === 'admin' ? 'Awaiting follow-up' : selectedProject ? `On ${selectedProject.name}` : 'Select a project to view'}</small></div>
        </section>

        {(workspaceError || notice) && <div className={`workspace-notice ${workspaceError ? 'notice-error' : ''}`} role="status">{workspaceError || notice}<button type="button" onClick={() => { setWorkspaceError(''); setNotice(''); }} aria-label="Dismiss message">×</button></div>}
        {mode === 'admin' && leadError && <div className="workspace-notice notice-error" role="alert">{leadError}</div>}

        <div className="workspace-grid">
          <section className="workspace-projects-panel" id="projects">
            <div className="workspace-panel-heading"><div><span className="workspace-section-kicker">PORTFOLIO</span><h2>{mode === 'admin' ? 'Projects' : 'Project list'}</h2></div><span className="workspace-result-count">{projects.length} total</span></div>
            {mode === 'admin' && <div className="workspace-client-roster" id="clients"><span>CLIENTS</span><strong>{profiles.length}</strong><small>Accounts connected</small></div>}
            {loading ? <p className="workspace-empty">Loading projects…</p> : projects.length === 0
              ? <div className="workspace-empty-state"><BriefcaseBusiness /><h3>{mode === 'admin' ? 'Your project list is clear' : 'No projects assigned yet'}</h3><p>{mode === 'admin' ? 'Add a client project to start tracking delivery here.' : 'The team will add your projects here when work begins.'}</p></div>
              : <div className="workspace-project-list">{projects.map((project) => {
                const profile = profiles.find((item) => item.user_id === project.client_id);
                return <button type="button" key={project.id} className={`workspace-project-row ${project.id === selectedProject?.id ? 'project-row-selected' : ''}`} onClick={() => setSelectedProjectId(project.id)}>
                  <span className="project-row-symbol"><FolderKanban size={17} /></span>
                  <span className="project-row-main"><strong>{project.name}</strong><small>{mode === 'admin' ? profile?.company || profile?.email || 'Client' : project.service}</small></span>
                  <span className={`project-status status-${project.status}`}>{statusLabel(project.status)}</span>
                  <span className="project-row-progress"><span><i style={{ width: `${project.progress}%` }} /></span><small>{project.progress}%</small></span>
                </button>;
              })}</div>}
            {mode === 'admin' && <details className="workspace-create-project">
              <summary><Plus size={16} />Create a project</summary>
              <form className="workspace-form" onSubmit={handleCreateProject}>
                <label>Client account<select name="client_id" required defaultValue=""><option value="" disabled>Select a client</option>{profiles.map((profile) => <option value={profile.user_id} key={profile.user_id}>{profile.company || profile.full_name || profile.email} · {profile.email}</option>)}</select></label>
                <label>Project name<input name="name" required maxLength={150} placeholder="e.g. Client portal redesign" /></label>
                <label>Service<input name="service" required maxLength={150} placeholder="Web application" /></label>
                <label>Project summary<textarea name="summary" rows={3} maxLength={3000} placeholder="What are we delivering?" /></label>
                <div className="workspace-form-row"><label>Start date<input name="start_date" type="date" /></label><label>Target date<input name="target_date" type="date" /></label></div>
                <Button type="submit" disabled={projectBusy || profiles.length === 0}>{projectBusy ? 'Creating…' : 'Create project'}<ArrowRight /></Button>
                {profiles.length === 0 && <small className="workspace-form-hint">Create a client account in Supabase Auth first.</small>}
              </form>
            </details>}
            {mode === 'admin' && <section className="workspace-leads-panel" id="leads">
              <div className="workspace-panel-heading"><div><span className="workspace-section-kicker">INCOMING ENQUIRIES</span><h2>Lead inbox</h2></div><span className="workspace-result-count">{leads.length} requests</span></div>
              {leadsLoading ? <p className="workspace-empty">Loading leads…</p> : leads.length === 0
                ? <div className="workspace-empty-state"><Mail /><h3>No requests yet</h3><p>Website enquiries will appear here when someone contacts the team.</p></div>
                : <div className="workspace-lead-list">{leads.map((lead) => <article className="workspace-lead-row" key={lead.id}>
                  <div className="workspace-lead-heading"><span className="lead-type-label">{lead.request_type.replaceAll('_', ' ')}</span><time>{displayDate(lead.created_at)}</time></div>
                  <h3>{lead.name}</h3>
                  <p className="workspace-lead-company">{lead.company || 'Individual'} · {lead.service}</p>
                  <a className="workspace-lead-email" href={`mailto:${lead.email}`}><Mail size={12} />{lead.email}</a>
                  <p className="workspace-lead-message">{lead.message}</p>
                  <label className="workspace-lead-status">Lead status<select value={leadStatuses.some((item) => item.value === lead.status) ? lead.status : 'new'} onChange={(event) => void handleLeadStatusChange(lead.id, event.target.value as LeadStatus)}>{leadStatuses.map((status) => <option value={status.value} key={status.value}>{status.label}</option>)}</select></label>
                </article>)}</div>}
            </section>}
          </section>

          <div className="workspace-detail-column">
            {selectedProject ? <>
              <section className="workspace-detail-panel">
                <div className="workspace-detail-top"><span className="workspace-section-kicker">PROJECT OVERVIEW</span><span className={`project-status status-${selectedProject.status}`}>{statusLabel(selectedProject.status)}</span></div>
                <h2>{selectedProject.name}</h2>
                <p className="workspace-detail-service">{selectedProject.service}{mode === 'admin' && selectedClient ? ` · ${selectedClient.company || selectedClient.email}` : ''}</p>
                {selectedProject.summary && <p className="workspace-project-summary">{selectedProject.summary}</p>}
                <div className="workspace-progress-head"><span>PROJECT PROGRESS</span><strong>{selectedProject.progress}%</strong></div>
                <div className="workspace-progress-track"><i style={{ width: `${selectedProject.progress}%` }} /></div>
                <div className="workspace-date-row"><span><small>STARTED</small><strong>{displayDate(selectedProject.start_date)}</strong></span><span><small>TARGET DELIVERY</small><strong>{displayDate(selectedProject.target_date)}</strong></span></div>
              </section>

              {mode === 'admin' && <details className="workspace-update-editor">
                <summary><Check size={16} />Update progress</summary>
                <form className="workspace-form" onSubmit={handlePostUpdate}>
                  <div className="workspace-form-row"><label>Progress (%)<input name="progress" type="number" min="0" max="100" required defaultValue={selectedProject.progress} /></label><label>Status<select name="status" defaultValue={selectedProject.status}>{projectStatuses.map((status) => <option value={status.value} key={status.value}>{status.label}</option>)}</select></label></div>
                  <label>Update title<input name="title" maxLength={150} required placeholder="Milestone reached" /></label>
                  <label>Client update<textarea name="body" rows={3} maxLength={3000} required placeholder="Share what changed and what comes next." /></label>
                  <Button type="submit" disabled={projectBusy}>{projectBusy ? 'Saving…' : 'Publish update'}<ArrowRight /></Button>
                </form>
              </details>}

              <section className="workspace-updates-panel">
                <div className="workspace-panel-heading"><div><span className="workspace-section-kicker">DELIVERY LOG</span><h2>Latest updates</h2></div></div>
                {selectedUpdates.length === 0
                  ? <p className="workspace-empty">Project notes from the team will appear here.</p>
                  : <div className="workspace-update-list">{selectedUpdates.slice(0, 5).map((update) => <article key={update.id} className="workspace-update-item"><span className="update-marker" /><div><div className="update-date">{displayDate(update.created_at)}</div><h3>{update.title}</h3><p>{update.body}</p></div></article>)}</div>}
              </section>
            </> : <section className="workspace-detail-empty"><FolderKanban /><h2>Select a project</h2><p>Choose a project from the list to see progress, updates and messages.</p></section>}

            <section className="workspace-chat-panel" id="conversation">
              <div className="workspace-panel-heading"><div><span className="workspace-section-kicker">DIRECT LINE</span><h2>Project conversation</h2></div><span className="chat-online-indicator">TEAM CHAT</span></div>
              <div className="workspace-chat-context">{selectedProject ? <><MessageCircle size={15} /><span>{selectedProject.name}</span></> : <span>Select a project to open its conversation.</span>}</div>
              <div className="workspace-chat-messages" aria-live="polite">
                {!selectedProject ? <p className="workspace-empty">Project messages stay together in each project.</p> : messages.length === 0
                  ? <div className="workspace-chat-empty"><MessageCircle /><p>No messages yet. Start the conversation with the project team.</p></div>
                  : messages.map((message) => {
                    const ownMessage = message.author_id === userId;
                    const author = ownMessage ? 'You' : mode === 'admin'
                      ? profiles.find((profile) => profile.user_id === message.author_id)?.full_name || 'Client'
                      : 'iTheku team';
                    return <article key={message.id} className={`workspace-message ${ownMessage ? 'message-own' : ''}`}>
                      <div className="message-author"><span>{author}</span><time>{new Intl.DateTimeFormat('en-ZA', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }).format(new Date(message.created_at))}</time></div>
                      <p>{message.body}</p>
                    </article>;
                  })}
              </div>
              {selectedProject && <form className="workspace-chat-form" onSubmit={handleSendMessage}>
                <label className="sr-only" htmlFor="project-message">Write a project message</label>
                <textarea id="project-message" rows={2} maxLength={3000} value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} placeholder="Write a message…" />
                <Button type="submit" size="icon" aria-label="Send message" disabled={messageBusy || !messageDraft.trim()}><Send size={17} /></Button>
              </form>}
              {messageError && <p className="workspace-inline-error" role="alert">{messageError}</p>}
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>;
}

function LoginScreen({
  mode,
  email,
  password,
  busy,
  error,
  resetSent,
  configured,
  onEmail,
  onPassword,
  onSubmit,
  onReset,
}: {
  mode: PortalMode;
  email: string;
  password: string;
  busy: boolean;
  error: string;
  resetSent: boolean;
  configured: boolean;
  onEmail: (value: string) => void;
  onPassword: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}) {
  return <main className="portal-login-page">
    <section className="portal-login-layout">
      <aside className="portal-login-aside">
        <Link to="/" className="portal-login-brand"><img src={logo.url} alt="iTheku Tech-Enterprise" /><span>iTheku Tech-Enterprise</span></Link>
        <div className="portal-aside-copy"><span className="workspace-eyebrow"><ShieldCheck size={14} />PRIVATE WORKSPACE</span><h1>{mode === 'admin' ? 'Every project. One clear view.' : 'Your work, in progress.'}</h1><p>{mode === 'admin' ? 'Keep delivery moving with project updates and direct client conversations.' : 'A shared space to follow milestones and talk directly with the team.'}</p></div>
        <div className="portal-aside-foot"><span>01</span><span>DESIGNED FOR CLEARER DELIVERY</span><span className="portal-aside-line" /></div>
      </aside>
      <div className="portal-login-main">
        <Link to="/" className="portal-back-link">← <span>Back to website</span></Link>
        <div className="portal-login-form-wrap">
          <span className="workspace-eyebrow">{mode === 'admin' ? 'TEAM ACCESS' : 'CLIENT ACCESS'}</span>
          <h2>{mode === 'admin' ? 'Welcome back' : 'Sign in to your workspace'}</h2>
          <p>{mode === 'admin' ? 'Use your iTheku team account to continue.' : 'Your project updates are waiting for you.'}</p>
          {!configured && <div className="portal-config-hint" role="status">Supabase isn’t connected yet. Add your project URL and publishable key to enable sign-in.</div>}
          {error && <div className="portal-login-error" role="alert">{error}</div>}
          {resetSent && <div className="portal-config-hint" role="status">If that account exists, a password reset email is on its way.</div>}
          <form className="portal-login-form" onSubmit={onSubmit}>
            <label>Email address<input type="email" autoComplete="username" required value={email} onChange={(event) => onEmail(event.target.value)} placeholder="name@company.com" /></label>
            <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => onPassword(event.target.value)} placeholder="Enter your password" /></label>
            <div className="portal-login-actions"><button type="button" onClick={onReset} disabled={!configured}>Forgot password?</button></div>
            <Button className="portal-login-submit" type="submit" disabled={!configured || busy}>{busy ? 'Signing in…' : 'Continue'}<ArrowRight /></Button>
          </form>
          <p className="portal-login-footnote">{mode === 'admin' ? 'Staff accounts are provisioned by your workspace administrator.' : 'Need an account? Contact your iTheku project lead.'}</p>
          <p className="portal-login-switch">{mode === 'admin' ? <>Client? <Link to="/client-portal">Open client access</Link></> : <>iTheku team? <Link to="/admin-portal">Open staff access</Link></>}</p>
        </div>
        <div className="portal-login-footer"><span>© {new Date().getFullYear()} iTheku Tech-Enterprise</span><span>Durban · South Africa</span></div>
      </div>
    </section>
  </main>;
}

function AccessNotice({ title, message, onSignOut, adminLink = false }: { title: string; message: string; onSignOut: () => void; adminLink?: boolean }) {
  return <main className="portal-access-page"><section><ShieldCheck /><span className="workspace-eyebrow">PRIVATE WORKSPACE</span><h1>{title}</h1><p>{message}</p><div className="portal-access-actions">{adminLink && <Button asChild><Link to="/admin-portal">Open project desk<ArrowRight /></Link></Button>}<Button variant="outline" onClick={onSignOut}><LogOut />Sign out</Button></div></section></main>;
}
# Pinely Improvement Plan

## Phase 1: Core Experience Polish
Get the current flow feeling complete before adding AI.

### 1.1 Navigation & Control
- [ ] Add back button to go from clusters → dump, focus → clusters
- [ ] Let users click on a cluster card to select that cluster (not just random)
- [ ] Let users click on an idea within a cluster to focus on it
- [ ] Add subtle page transitions with framer-motion

### 1.2 Visual Feedback
- [ ] Add entrance animations for clusters (stagger reveal)
- [ ] Add micro-interactions (button hover states, card selections)
- [ ] Add a subtle progress indicator (step 1/2/3)
- [ ] Better loading states with skeleton UI

### 1.3 Cleanup
- [ ] Remove unused `sapling/` boilerplate folder
- [ ] Use lucide-react icons where appropriate (back arrow, checkmark, etc.)
- [ ] Remove or use framer-motion properly

---

## Phase 2: Real AI Integration ✅ PLANNED
Replace stubbed logic with actual LLM calls using **Google Gemini** (free tier: 1M tokens/month).

### 2.1 Setup
- [ ] Install `@google/generative-ai` package
- [ ] Create `.env.local` with `GEMINI_API_KEY`
- [ ] Add env validation

### 2.2 API Routes
- [ ] Create `/api/organize` route
  - POST: receives `{ rawDump: string }`
  - Returns `{ clusters: Cluster[] }`
  - Uses Gemini to semantically group thoughts

- [ ] Create `/api/action` route
  - POST: receives `{ idea: string, time: string, mood: string }`
  - Returns `{ action: string }`
  - Generates contextual, gentle next steps

### 2.3 Prompt Engineering
**Clustering Prompt** - should:
- Group thoughts by semantic meaning (not keywords)
- Create 2-6 clusters with meaningful titles
- Handle messy, stream-of-consciousness input
- Return valid JSON

**Action Prompt** - should:
- Consider the specific idea content
- Scale ambition based on time (5min vs 30min vs open)
- Scale effort based on mood (tired → tiny step, focused → deeper dive)
- Be warm, non-judgmental, actionable
- Return a single concrete next step

### 2.4 Error Handling
- [ ] Graceful fallback if API fails
- [ ] Rate limit handling
- [ ] Loading states with meaningful messages

### 2.5 Update Frontend
- [ ] Update `ai.ts` to call API routes instead of stubbed logic
- [ ] Handle API errors gracefully
- [ ] Show toast/message on failure

---

## Phase 3: Session Management
Let users keep history and track progress.

### 3.1 Multiple Sessions
- [ ] Save dumps with timestamps
- [ ] Session list view to return to past dumps
- [ ] Delete sessions

### 3.2 Action Tracking
- [ ] Mark actions as "done"
- [ ] Generate next action for same idea
- [ ] Simple completion history

### 3.3 Data Layer
- [ ] Consider IndexedDB for more robust local storage
- [ ] OR simple backend with database for cross-device sync

---

## Phase 4: Quality of Life

### 4.1 Accessibility
- [ ] Keyboard navigation throughout
- [ ] ARIA labels on interactive elements
- [ ] Focus management between screens

### 4.2 Mobile Polish
- [ ] Test and fix any mobile viewport issues
- [ ] Touch-friendly tap targets
- [ ] Safe area handling

### 4.3 Error Handling
- [ ] Toast notifications for errors
- [ ] Retry mechanisms for failed API calls
- [ ] Graceful degradation if AI unavailable

---

## Recommended Order

1. **Phase 1** first - makes the app feel complete
2. **Phase 2.1-2.2** - pick an LLM provider and wire it up
3. **Phase 2.3** - iterate on prompts until clustering feels magical
4. **Phase 3** - only if users want history
5. **Phase 4** - polish before launch

---

## Tech Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| LLM Provider | **Google Gemini** | Free tier (1M tokens/month), good quality |
| AI SDK | `@google/generative-ai` | Official SDK, simple API |
| State mgmt | useState | Simple enough for current scope |
| Persistence | localStorage | Fine for MVP |

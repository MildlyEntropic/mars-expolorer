# Future Features - Mars Explorer v2.0+

## Community Tagging System

### Problem Statement
NASA has millions of Mars rover images but limited resources to manually tag/label them. Meanwhile, communities of space enthusiasts would love to help categorize this data as a hobby.

### Core Concept
A Wikipedia/Zooniverse-style consensus system where users can add descriptive tags to images, with voting to establish accuracy.

### Proposed Features

#### 1. User Tagging
- Allow users to add free-form tags to any image
- Suggest common tags (rock, wheel, horizon, crater, dust devil, sky, etc.)
- Track tag frequency across all images

#### 2. Voting/Consensus Mechanism
- Users can upvote or downvote existing tags
- Tags reach "confirmed" status after threshold votes
- Controversial tags stay in "proposed" state
- Similar to Wikipedia's edit consensus model

#### 3. LLM Auto-Tagger (First Pass)
- Run new images through vision LLM for initial tag suggestions
- LLM tags marked as "AI-suggested" until human verified
- Reduces cold-start problem for new images

#### 4. Verification "Captcha Game"
- Gamified verification: "Here are the latest 100 LLM tags. Do you agree?"
- Users quickly approve/reject AI suggestions
- Makes verification feel like a mini-game rather than work
- Could show accuracy score / leaderboard

### Technical Requirements

#### Database
- Store tags with image IDs
- Track votes per tag
- User accounts (or anonymous session-based voting)
- Tag history/audit log

#### API Endpoints
```
POST /api/tags/:imageId - Add tag to image
GET /api/tags/:imageId - Get tags for image
POST /api/tags/:imageId/:tagId/vote - Upvote/downvote tag
GET /api/tags/pending - Get LLM tags awaiting verification
POST /api/tags/verify - Batch verify LLM suggestions
```

#### Search Integration
- Index confirmed tags for text search
- Enable filtering by tag (e.g., "show all images tagged 'dust devil'")
- This would unlock text search for MER rovers (Spirit/Opportunity) which currently lack metadata

### Benefits
1. Makes archival NASA data searchable
2. Engages enthusiast community
3. Crowdsources work NASA doesn't have resources for
4. Creates valuable training data for future AI models
5. Gamification increases participation

### Considerations
- Moderation for inappropriate tags
- Rate limiting to prevent spam
- Sybil attack prevention (fake accounts mass-voting)
- Accessibility of verification game
- Mobile-friendly interface

### Inspiration
- Zooniverse citizen science projects
- Wikipedia consensus editing
- reCAPTCHA's dual-purpose verification
- Galaxy Zoo (astronomy citizen science)

---

## Other Future Ideas

### Image Enhancement
- Apply AI upscaling to low-res historical images
- Color correction / white balance normalization
- Panorama stitching from sequential images

### Timeline View
- Visual timeline of rover's journey
- Map overlay showing image locations
- "This day in Mars history" feature

### Favorites / Collections
- Let users save favorite images
- Create shareable collections/galleries
- Export options (wallpapers, prints)

### Social Features
- Share images to social media with proper attribution
- Embed codes for blogs/websites
- "Image of the day" community picks

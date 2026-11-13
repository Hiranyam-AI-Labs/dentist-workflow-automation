# Media Asset & Video Offloading Architecture Standard

> **Standard for managing large media files, videos, audio, and heavy assets across client applications by offloading streaming and delivery to YouTube and Edge CDNs.**

---

## 1. Core Architectural Principle: Zero-Bloat VPS & Git Repositories

Serving raw video files (`.mp4`, `.mov`, `.avi`, `.webm`) directly from Hostinger Docker containers or storing them in Git repositories causes:
- **Server CPU & Memory Spikes:** Video streaming consumes container sockets and memory buffers.
- **Bandwidth Saturation:** VPS network throughput degrades for API calls and dynamic web traffic.
- **Docker Image & Git Bloat:** Large binary blobs inflate container build sizes and slow down clone/pull operations.

### Mandatory Standard:
1. **Never commit raw video files > 5MB into Git repositories.**
2. **Never host multi-megabyte video files inside Docker production containers.**
3. **Offload video hosting to YouTube (Unlisted, Public, or Embedded Playlists) or dedicated Cloudflare R2 / Vimeo CDN.**
4. **Embed videos via lightweight responsive iframe Web Components (e.g. Lite YouTube Embed).**

---

## 2. YouTube Upload & Privacy Classification

| Video Category | YouTube Privacy Setting | Typical Use Case |
| :--- | :--- | :--- |
| **Public Platform Overviews** | **Public** | Product demos, public trust programmes, brand showreels, introductory videos. |
| **Course & Learning Content** | **Unlisted / Playlist** | Educational tutorials, yoga/health sessions, client portal training videos. |
| **Client Presentations & Pitches**| **Unlisted** | Stakeholder pitch decks, interactive feature walkthroughs, prototype demonstrations. |
| **Confidential / PII Testimonials**| **Private / Dedicated Storage**| Medical consultations, internal audit videos (must NEVER be public). |

---

## 3. High-Performance Web Embedding Standard

### 3.1 Lite YouTube Embed (Zero Initial JS Payload)
Direct `<iframe>` embeds download 500KB+ of heavy Google JavaScript before the user even clicks play. Use **Lite YouTube Embed** pattern:

```html
<!-- High-Performance Lazy-Loaded YouTube Component -->
<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px;">
  <iframe 
    src="https://www.youtube-nocookie.com/embed/VIDEO_ID?rel=0&modestbranding=1" 
    title="Project Video Demonstration" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen
    loading="lazy"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
  </iframe>
</div>
```

### 3.2 React / Next.js Component Pattern
```tsx
import React from 'react';

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

export const YouTubeEmbed: React.FC<VideoPlayerProps> = ({ videoId, title }) => (
  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-neutral-900">
    <iframe
      className="absolute top-0 left-0 w-full h-full"
      src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
    />
  </div>
);
```

---

## 4. Image & Static Asset Optimization

- Convert all raster images (`.png`, `.jpg`) to modern **WebP** or **AVIF** formats.
- Aim for image file sizes < 300 KB for hero graphics and < 100 KB for content illustrations.
- Use SVGs for icons, logos, and vector illustrations.
- Store original raw assets in project `_source_material/` (which must be excluded in `.gitignore`).

---

## 5. Mandatory Native AI Image Generation over HTML Screenshots (P0 Rule 31 / ADR-0028)

1. **Strict Prohibition of HTML-to-Image / HTML Screenshot-Cropping**: Never create HTML/CSS and screenshot, rasterize, cut, or crop it as an image, pamphlet, visiting card, or poster.
2. **Native AI Image Intelligence First**: All graphics, visual designs, brochures, flyers, and banners must be synthesized directly using native AI image generation tools (`generate_image`, Google Imagen, Gemini visual synthesis, Nano Banana prompt architecture).
3. **High-Resolution Quality & Composition**: Prompts must specify tactile materials, cinematic lighting, precise aspect ratios (`1:1`, `2:3`, `3:2`, `16:9`), and brand color tokens.
4. **Vector PDF Composition for Print**: Print deliverables (cards, brochures) must use Python ReportLab vector PDFs embedding the high-resolution AI background art with vector typography and QR codes. Never use HTML screenshotting.
5. **Reference**: See authoritative standard in `standards/ai-image-and-visual-design-standards.md` and `openspec/decisions/ADR-0028-native-ai-image-generation-over-html-standard.md`.


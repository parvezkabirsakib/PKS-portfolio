# MD Parvez Kabir Sakib — Personal Portfolio Website

A modern, responsive, multi-page personal portfolio website built with **HTML5, CSS3, and Vanilla JavaScript**. The project combines a luxury dark visual theme, interactive animations, academic and project showcases, technical skills, a downloadable CV, a multimedia gallery, and a contact interface.

<p align="center">
  <a href="https://parvezkabirsakib.github.io/PKS-portfolio/">
    <img src="https://img.shields.io/badge/Live-Portfolio-FF8C00?style=for-the-badge&logo=githubpages&logoColor=white" alt="Live Portfolio">
  </a>
  <img src="https://img.shields.io/badge/HTML5-Markup-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js">
</p>

---

## Project Overview

This repository contains the source code for the personal portfolio website of **MD Parvez Kabir Sakib**, a Computer Science and Engineering student at **Daffodil International University**.

The website is designed as a central place to present academic progress, software and web development projects, technical skills, creative media work, and professional contact information. Instead of using a conventional single-page template, the project follows a structured seven-page architecture, with each page dedicated to a specific area of the developer's profile.

### Primary Objectives

- **Professional Identity:** Present the developer's background, interests, academic journey, and work in a consistent online portfolio.
- **Project Presentation:** Organize academic and personal projects with descriptions, technology details, repository links, and live demonstrations where available.
- **Interactive Experience:** Use animations, scroll-based reveals, an animated preloader, and a custom glass-shatter hero effect.
- **Technical Skills Showcase:** Present web development, programming, and multimedia skills in clearly organized categories.
- **Accessible CV:** Provide an on-page CV view with print and PDF download options.
- **Communication:** Provide contact information, social links, and a message form integrated with FormSubmit.

### Live Website

**[Visit the Portfolio Website](https://parvezkabirsakib.github.io/PKS-portfolio/)**

---

## Technologies Used

The project uses standard frontend technologies and browser APIs, together with selected libraries and external services.

### Frontend & Core Technologies

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure and content |
| CSS3 | Layout, responsive styling, animations, and visual design |
| JavaScript (ES6+) | DOM interaction, navigation behavior, validation, and dynamic UI |
| Three.js / WebGL | Custom glass-shatter text animation on the homepage |
| Canvas | Rendering support for the custom visual effect |
| SVG | Infinity-loop preloader and circular skill indicators |
| Google Fonts — Poppins | Website typography |
| Font Awesome 6.5.1 | Interface and technology icons |

### Browser APIs & Services

| Technology / Service | Purpose |
|---|---|
| IntersectionObserver | Scroll-triggered content reveal and skill animations |
| sessionStorage | Remembers the homepage preloader state during a browser session |
| FormSubmit | External contact-form message processing |
| Hidden iframe target | Allows the documented form workflow to submit without navigating away |
| Node.js HTTP module | Lightweight local development server |
| GitHub Pages | Public static website hosting |

---

## Website Features

### 1. Home Page

The homepage introduces the developer and provides quick access to the main portfolio sections.

**Key features:**
- Hero section introducing MD Parvez Kabir Sakib.
- Custom glass-shatter text animation using the dedicated `shatter-type.js` engine.
- Animated SVG infinity-loop preloader.
- Session-based preloader behavior using `sessionStorage`.
- Main calls to action, including work exploration, contact, and CV access.
- Overview and highlight sections.
- Scroll-triggered reveal animations.

### 2. Education Page

The Education page presents the developer's academic background and completed training.

**Key features:**
- Academic timeline.
- Daffodil International University — Computer Science and Engineering (ongoing).
- Bright Skills — Web Design and WordPress Theme Customization.
- Creative IT Institute — Web Development and UI Design training.
- Course and certificate references where available.

### 3. Projects Page

The Projects page presents academic and practical development work in an organized showcase.

**Featured projects:**

| Project | Semester / Category | Technologies | Project Links |
|---|---|---|---|
| Student Management System | 1st Semester — Team Project | C, Structured Programming | [GitHub Repository](https://github.com/parvezkabirsakib/TeamAdHoc) |
| Bondhon | 2nd Semester — Team Project | Web Design, Interactive Media | [Live Site](https://sites.google.com/view/adhocbondhon/home?authuser=0) · [GitHub](https://github.com/parvezkabirsakib/Bondhon) |
| Dorapocket Frontend | 4th Semester — E-Commerce | HTML5, CSS3, JavaScript | [Live Demo](https://parvezkabirsakib.github.io/Front_End_Dorapocket_updated/) · [GitHub](https://github.com/parvezkabirsakib/Front_End_Dorapocket_updated) |
| Nokia Space Shooter | 6th Semester — Graphics Project | C++, OpenGL | [GitHub Repository](https://github.com/parvezkabirsakib/Space_Shooter_opengl) |
| Orbit Combustion Lab | 9th Semester — Project | Computational Simulation, Systems Modeling | [GitHub Repository](https://github.com/parvezkabirsakib/Orbit_Combustion_Lab) |

### 4. Activities & Skills Page

The Activities page organizes technical and creative skills into categories.

**Core web skills:**
- HTML — 80%
- CSS — 75%
- WordPress — 45%

**Programming and development:**
- Python — 60%
- JavaScript — 55%
- C Programming — 50%

**Media and audio-visual production:**
- Adobe Premiere Pro — 75%
- Adobe Audition — 70%

The page uses animated linear progress bars and circular SVG meters to display the documented proficiency values.

### 5. Curriculum Vitae Page

The CV page presents the developer's résumé in a browser-friendly format.

**Key features:**
- Structured CV content.
- Profile summary and education information.
- Technical proficiency and project sections.
- Language and declaration sections.
- Browser print functionality.
- Direct PDF download from `assets/documents/CV.pdf`.

### 6. About Me Page

The About Me page provides personal background information and communication options.

**Key features:**
- Biography and development interests.
- Direct contact information cards.
- Social media links for Facebook, X, LinkedIn, and Threads.
- Responsive two-column message form.
- Name, email, subject, and message fields.
- Client-side input and email-format validation.
- Form submission through FormSubmit.
- Submission status feedback and a `mailto:` fallback for local file-protocol testing.

### 7. Video Page

The Video page organizes video demonstrations and multimedia content.

**Key features:**
- Category-based media filtering.
- Academic project spotlight featuring the Dorapocket project.
- Eight YouTube video entries.
- Four Facebook Reels entries.
- Thumbnail-based video cards.
- External video links and play overlays.

**Documented media collection:** 13 items in total.

---

## Design System

The website follows a luxury dark visual style with vivid orange accents.

### Color Palette

| Design Token | Color | Purpose |
|---|---|---|
| Primary Background | `#0b0f19` | Main dark background |
| Secondary Background | `#0f172a` | Elevated sections |
| Card Background | `#111827` | Content cards |
| Card Hover | `#1e293b` | Interactive card state |
| Primary Orange | `#FF8C00` | Main accent color |
| Cyan Accent | `#38bdf8` | Complementary accent |
| Primary Text | `#f8fafc` | Main headings and text |
| Secondary Text | `#94a3b8` | Supporting content |
| Muted Text | `#64748b` | Secondary metadata |

### Visual Design Details

- Poppins typography.
- Dark navy-black background.
- Neon orange accent colors.
- Glassmorphism and backdrop blur.
- Gradient buttons and hover effects.
- Rounded cards and subtle borders.
- Responsive grids and flexible layouts.
- Scroll-based reveal transitions.

---

## Animation & Interaction Architecture

### 1. Glass-Shatter Hero Animation

The `js/shatter-type.js` file manages the custom animated developer-name effect.

The documented implementation includes:
- Canvas-based text preparation.
- Procedural polygon fragmentation.
- WebGL rendering.
- Particle movement and rotation.
- Lighting and orange gradient effects.
- Viewport boundary constraints.

### 2. Infinity-Loop Preloader

The homepage includes an SVG infinity-loop loading animation with an orange gradient and glow effect. Its session state is managed using `sessionStorage` to avoid repeating the full loading experience during the same browser session.

### 3. Scroll Reveal Animations

The master script uses `IntersectionObserver` to detect when elements enter the viewport and apply reveal classes.

### 4. Animated Skill Indicators

Linear progress bars and circular SVG meters animate according to their configured percentage values.

### 5. Responsive Navigation

The navigation system supports desktop and mobile layouts, including a mobile menu toggle and current-page highlighting.

---

## Project Structure

```text
PKS-portfolio/
│
├── index.html                  # Homepage and hero animation
├── about.html                  # Biography and contact page
├── education.html              # Academic timeline and training
├── projects.html               # Project showcase
├── activities.html             # Technical and creative skills
├── cv.html                     # Curriculum Vitae viewer
├── video.html                  # Multimedia video gallery
│
├── dev-server.js               # Node.js local development server
├── favicon.ico                 # Browser favicon
├── report.md                   # Project documentation
│
├── css/
│   └── style.css               # Main design system and responsive styles
│
├── js/
│   ├── script.js               # Main interaction controller
│   └── shatter-type.js         # WebGL glass-shatter animation engine
│
└── assets/
    ├── documents/
    │   └── CV.pdf              # Downloadable CV
    │
    ├── images/
    │   ├── profile.jpg
    │   ├── favicon.png
    │   ├── favicon.svg
    │   ├── certificate-bright-skills.png
    │   ├── certificate-creative-it.png
    │   ├── certificate-premiere-pro.jpg
    │   ├── project-1.jpg
    │   ├── project-2.jpg
    │   ├── project-3.jpg
    │   ├── project-4.jpg
    │   ├── project-5.jpg
    │   ├── video-thumb-1.jpg ... video-thumb-8.jpg
    │   └── video-fb-1.jpg ... video-fb-4.jpg
    │
    └── videos/                 # Local video cache directory
```

---

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your computer.
- Git installed.
- A modern web browser.

### 1. Clone the Repository

```bash
git clone https://github.com/parvezkabirsakib/PKS-portfolio.git
```

### 2. Navigate to the Project Directory

```bash
cd PKS-portfolio
```

### 3. Start the Local Development Server

```bash
node dev-server.js
```

### 4. Open the Website

Visit the following address in your browser:

```text
http://localhost:5500/
```

Useful local routes:

- Home: `http://localhost:5500/`
- Education: `http://localhost:5500/education.html`
- Projects: `http://localhost:5500/projects.html`
- Activities: `http://localhost:5500/activities.html`
- CV: `http://localhost:5500/cv.html`
- About: `http://localhost:5500/about.html`
- Video: `http://localhost:5500/video.html`

---

## Contact Form Configuration

The About page uses [FormSubmit](https://formsubmit.co/) as an external form-processing service.

The documented form workflow includes:
- Client-side required-field validation.
- Email-format validation.
- Submission feedback states.
- Hidden iframe submission target.
- Local `file://` protocol detection.
- A `mailto:` fallback for local testing.

**Initial activation:** FormSubmit may require an initial verification/activation step for the receiving email address. Submit a test message and follow the activation instructions sent by the service. Verify successful delivery before relying on the form.

---

## Deployment

The portfolio is deployed using **GitHub Pages**.

**Live deployment:**  
https://parvezkabirsakib.github.io/PKS-portfolio/

The project is a static website and does not require a custom application backend for its normal hosting.

Other static hosting options include:
- GitHub Pages
- Netlify
- Vercel

---

## Future Improvements

Possible future development directions include:

- Backend API integration.
- Database-driven project and content management.
- Secure admin dashboard.
- Enhanced contact-form management and spam protection.
- Search and filtering for project entries.
- Further accessibility improvements.
- Image, script, and animation performance optimization.
- Additional project case studies and demonstrations.
- Bangla and English language options.

---

## Developer

**MD Parvez Kabir Sakib**  
Computer Science & Engineering  
Daffodil International University  
Dhaka, Bangladesh

- **Portfolio:** [parvezkabirsakib.github.io/PKS-portfolio](https://parvezkabirsakib.github.io/PKS-portfolio/)
- **GitHub:** [@parvezkabirsakib](https://github.com/parvezkabirsakib)

For professional inquiries, please use the contact section on the portfolio website.

---

## License

This repository is a personal portfolio project. Unless a separate license is included in the repository, the source code and original assets should be treated as the developer's work. Please contact the developer before reusing original branding, content, or assets.

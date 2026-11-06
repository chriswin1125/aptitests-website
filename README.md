# Aptitude Pro – Complete Aptitude Learning & Testing Platform

A premium, modern aptitude preparation platform inspired by the visual design language of **Samsung.com**, built for banking aspirants, competitive examination candidates, and campus placements.

## 🚀 Live Demo

- **Live Web Application**: [https://proapti.vercel.app](https://proapti.vercel.app)
- **Backend API**: [https://aptitests-website.onrender.com](https://aptitests-website.onrender.com)

---

## 🌟 Key Features

1. **Samsung.com Design Language**
   - Clean white & black theme with `#1428A0` accent and `#E8ECF5` secondary accent.
   - Large bold editorial headlines, generous spacing, rounded cards with ambient shadows.
   - Sticky navbar with backdrop blur and responsive mobile hamburger menu.
   - Global Instant Search modal (triggered by button or `Ctrl+K` / `Cmd+K`).

2. **Complete 5-Track Aptitude Categorization (68 Topics)**
   - **Quantitative Aptitude (25 Topics)**: Number System, Simplification, Percentage, Profit & Loss, Simple & Compound Interest, Ratio, Time & Work, Time Speed Distance, Permutations, Probability, Mensuration, Geometry, Algebra, etc.
   - **Logical Reasoning (22 Topics)**: Number Series, Coding-Decoding, Blood Relations, Direction Sense, Seating Arrangement, Syllogisms, Inequalities, Puzzles, Clocks, Calendars, etc.
   - **Verbal Ability (15 Topics)**: Reading Comprehension, Error Spotting, Synonyms & Antonyms, Para Jumbles, Active-Passive, etc.
   - **Data Interpretation (8 Topics)**: Table DI, Bar Graphs, Line Graphs, Pie Charts, Caselet DI, Missing DI, etc.
   - **Computer Aptitude (9 Topics)**: Fundamentals, OS, Networking, Databases, Cybersecurity, MS Office, etc.

3. **Individual Topic Learning Page (7-Section Architecture)**
   - **Section 1: Topic Introduction** (Why it matters, exam usage, difficulty, estimated time).
   - **Section 2: Concept Hierarchy** (Basic, Intermediate, Advanced, Shortcuts & Tricks, Common Mistakes).
   - **Section 3: Formula Book** (Math expressions, variable explanations, when to use, solved example, 1-click copy).
   - **Section 4: Solved Examples** (At least 5 detailed walkthroughs with step-by-step logic, examination shortcuts, and final answers).
   - **Section 5: Practice Questions** (Filtered by Beginner, Intermediate, Advanced, Exam-style with toggleable step-by-step solutions).
   - **Section 6: Topic Test** (Timed CBT test with question navigation palette, review status, and immediate scoring).
   - **Section 7: Performance** (Accuracy percentage, mastery level: Mastered / Proficient / Learning).

4. **Formula Book – Complete Formula Library**
   - High-frequency formulas across all Quant and Reasoning topics.
   - Instant search & topic filters.
   - 1-Click Copy Formula with clipboard toast.
   - Bookmark formulas (persisted to MongoDB user account).
   - Print & PDF download layout.

5. **Exam-Wise Preparation**
   - **Banking Exams**: IBPS PO, IBPS Clerk, SBI PO, SBI Clerk, RBI Assistant, RBI Grade B.
   - **Competitive Exams**: SSC CGL, SSC CHSL, RRB NTPC, RRB Group D, UPSC CSAT.
   - **Campus Recruitment Drives**: TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, Zoho, HCL.

6. **Interactive Mock Test System**
   - Realistic examination interface: Countdown timer, question palette, Mark for Review, Clear Response, Save & Next.
   - Negative marking penalty calculations.
   - Post-submission results dashboard with **Recharts** bar graphs, score metrics, and detailed question-by-question review.

7. **Daily Practice Challenge**
   - Daily 15-question sprint: 5 Quant, 5 Reasoning, 5 Verbal questions.
   - 15-minute countdown clock, streak counter, and instant evaluation.

8. **User Dashboard & Analytics**
   - Learning streak counter, tests attempted, average accuracy %, total learning hours.
   - Interactive progression line chart with Recharts.
   - Recommended topics and Continue Learning quick jumps.

9. **Admin Panel & Governance**
   - Platform stats (Users, Topics, Tests, Attempts).
   - User role management (User ⇄ Admin).
   - Add new formulas and curriculum topics directly to MongoDB.

---

## 🚀 Live Servers & Quick Start

Both servers are pre-launched and running:

- **Frontend Web App**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **Database**: MongoDB on standard port `27017` (Database: `aptitude_pro`)

### Demo Accounts for Instant Testing

The login modal contains **1-Click Quick Demo Login** buttons:
- **Aspirant / Student**: `aspirant@aptitudepro.com` / `student123`
- **Platform Admin**: `admin@aptitudepro.com` / `admin123`

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Framer Motion, Lucide React, Recharts, Canvas-Confetti
- **Backend**: Node.js, Express.js, Mongoose, JWT Authentication, bcryptjs
- **Database**: MongoDB

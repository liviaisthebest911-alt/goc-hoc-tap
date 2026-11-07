---
name: OJM
description: A little world of Liu, a personal magazine in pale pink and wine ink, ruled with staff lines.
colors:
  rose-ink: "#8F2549"
  rose: "#D9829F"
  petal: "#F2BCCF"
  cloth-1: "#8F2549"
  cloth-2: "#6A3B50"
  cloth-3: "#F2BCCF"
  cloth-4: "#FFF7FA"
  bg: "#FCE9F0"
  card: "#FFF7FA"
  pink-soft: "#FBDFE9"
  pink-blush: "#F8D6E2"
  ink: "#43182C"
  mute: "#6A3B50"
  line: "#F2BCCF"
  field-line: "#A9607C"
  danger: "#A81E3C"
typography:
  display:
    fontFamily: "Noto Serif Display, Georgia, serif"
    fontSize: "clamp(56px, 7.2vw, 96px)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Noto Serif Display, Georgia, serif"
    fontSize: "clamp(38px, 4.8vw, 64px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  article-title:
    fontFamily: "Noto Serif Display, Georgia, serif"
    fontSize: "clamp(36px, 5vw, 56px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  lead-title:
    fontFamily: "Noto Serif Display, Georgia, serif"
    fontSize: "clamp(30px, 3.1vw, 46px)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "clamp(23px, 2vw, 28px)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "0em"
  body:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.7
  reading:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.85
  label:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.7
  code:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "0.84em"
    fontWeight: 400
rounded:
  tight: "4px"
  paper: "6px"
  panel: "8px"
  field: "10px"
  code-block: "12px"
  sticker: "22px"
  pill: "999px"
spacing:
  chip-gap: "8px"
  head-gap: "28px"
  grid-gap: "clamp(20px, 2.4vw, 32px)"
  gutter: "clamp(20px, 3.4vw, 48px)"
  band: "clamp(48px, 6vw, 80px)"
  section: "clamp(72px, 9vw, 112px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.rose-ink}"
    textColor: "{colors.card}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
    height: "46px"
  button-ghost-hover:
    backgroundColor: "{colors.pink-blush}"
    textColor: "{colors.ink}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "4px 16px"
    height: "40px"
  chip-hover:
    backgroundColor: "{colors.pink-blush}"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
  tag:
    backgroundColor: "{colors.petal}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "3px 12px"
  search-field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "46px"
  input-field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "10px 14px"
  paper-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
    padding: "26px 28px 24px"
  blush-card:
    backgroundColor: "{colors.pink-blush}"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
  now-playing:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
    rounded: "{rounded.paper}"
    padding: "18px 20px 20px"
  book-cover:
    backgroundColor: "{colors.cloth-1}"
    textColor: "{colors.card}"
  piano-key:
    backgroundColor: "{colors.card}"
    textColor: "{colors.mute}"
  piano-key-hover:
    backgroundColor: "{colors.pink-soft}"
  piano-key-on:
    backgroundColor: "{colors.petal}"
  ribbon:
    backgroundColor: "{colors.rose-ink}"
    textColor: "{colors.card}"
    padding: "2px 14px 2px 12px"
---

# Design System: OJM

## Overview

**Creative North Star: "OJM"**

OJM reads as one issue of a personal magazine, made from a single person's real work. Its staff is literal: music staff lines are the recurring rule, and the notes on them stand for published posts, stories, and the bits of the name Li. The ground is pale pink, the paper is pink-white, and the type is high-contrast serif in wine ink.

Density is editorial. Large serif headings hold the space, and small Literata carries the detail. Public pages are composed asymmetrically, with paper layered and slightly rotated as if placed by hand. Reading pages drop all of that for one quiet column.

The world refuses a dark theme, dark brown or ivory as the main colour, loud gradients, heavy glassmorphism, and continuous animation.

**Key Characteristics:**
- Pale pink ground, pink-white paper, wine ink, and one peony-wine accent.
- High-contrast display serif at large sizes, with Literata for everything small or read at length.
- Five-line staffs as rules, dividers, covers, and timeline.
- Rotated paper layers with soft wine-tinted shadows.
- Book-cloth covers on a shelf.
- Motion that answers an event and then stops.

## Colors

A tight monochrome of pinks and wines, where depth of pink separates surfaces and wine carries all reading text.

### Primary
- **Peony Wine** (#8F2549): the accent. Links, emphasised words in headings, active notes, the nav underline, the focus ring, progress bars, and the Featured ribbon. It stays above 5:1 on every pink surface here, so it is safe as text.

### Secondary
- **Dusty Rose** (#D9829F): strokes and ornament. Staff lines, ghost and chip borders, the shelf board, list markers, and the `{ }` and `</>` marks.
- **Petal** (#F2BCCF): filled small accents. Tags, the learning pills, the pressed piano key, and the second story's cover field.

### Tertiary
- **Cloth Wine** (#8F2549), **Cloth Petal** (#F2BCCF), **Cloth Plum** (#6A3B50), **Cloth Paper** (#FFF7FA): the four book-cloth colours. They cycle in that order along any row of covers, with paper-coloured text on Wine and Plum and ink text on Petal and Paper.

### Neutral
- **Pale Pink Ground** (#FCE9F0): the page background and the sticky header.
- **Pink-White Paper** (#FFF7FA): cards, quotes, fields, and white piano keys.
- **Soft Blush** (#FBDFE9): quiet hover fills, inline code, code blocks, and the mascot frame.
- **Deep Blush** (#F8D6E2): the full-bleed band, the footer, the second story card, and ghost and chip hover fills.
- **Wine Ink** (#43182C): headings and body text, primary buttons, the selected chip, the Now Playing panel, and the piano case.
- **Muted Plum** (#6A3B50): secondary text, metadata, excerpts, and placeholders.
- **Hairline Pink** (#F2BCCF): 1px dividers and list rules.
- **Field Line** (#A9607C): the stroke around search and form inputs.
- **Danger** (#A81E3C): destructive links and form errors only.

### Named Rules
**The Ornament Rose Rule.** Dusty Rose never carries text someone has to read; it reaches only 2.36:1 on the ground. Ornament hidden from assistive technology, such as the `{ }` and `</>` marks, may use it.

**The Wine Panel Rule.** Wine Ink fills only small, deliberate objects, such as buttons, the selected chip, the Now Playing panel, and the piano case. It never becomes a page or section ground, because OJM has no dark theme.

**The Shared Names Rule.** Token names such as `--pink-soft` and `--rose-ink` are shared with Admin through the one global stylesheet. Renaming a token changes Admin pages too, so a rename has to cover both.

## Typography

**Display Font:** Noto Serif Display (with Georgia, serif)
**Body Font:** Literata (with Georgia, serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, Menlo, Consolas, monospace)

**Character:** Noto Serif Display brings the magazine masthead, with sharp contrast and a dramatic italic. Literata is sturdy and warm for long Vietnamese reading. All three families load with Vietnamese subsets.

### Hierarchy
- **Display** (400, clamp 56px to 96px, 0.98): the home masthead only. Under 720px it runs clamp 52px to 72px. An italic word in Peony Wine carries the emphasis.
- **Headline** (400, clamp 38px to 64px, 1.12): section titles on the home page.
- **Article Title** (400, clamp 36px to 56px, 1.12): post page titles. Inside Markdown, h1 and h2 stay in Display at 34px and 29px, and h3 uses Literata at 23px. Other page titles keep this voice at their own sizes, from 28px up.
- **Lead Title** (500, clamp 30px to 46px, 1.08): the featured story's title.
- **Title** (Literata 600, clamp 23px to 28px, 1.12): story titles and other `h3` headings.
- **Body** (Literata 400, 17px, 1.7): default text, 16px under 720px, with measures of about 34ch to 60ch.
- **Reading** (Literata 400, 19px, 1.85): post bodies in a 720px column, 17px under 720px. Story chapters use 1.95 line height in a 660px column. Chapter text runs 18px at 1.9 line height under 720px.
- **Label** (Literata 400, 14.5px): dates, read times, and other metadata, with tabular figures wherever a number is counted.
- **Code** (JetBrains Mono 400, 0.84em): inline code, code blocks, bits, and keycaps.

Italics do the work other systems give to weight or capitals: the footer line, the masthead emphasis, the figures in the learning ledger, and small panel headings.

### Named Rules
**The Hairline Floor Rule.** Noto Serif Display is for sizes of about 28px and up only, because its hairlines drop out below that. Anything smaller is Literata, even when it is a heading.

**The Machine Voice Rule.** JetBrains Mono is only for code and binary. That covers code samples, Markdown source in the editor, bits, the `{ }` and `</>` marks, and keycaps, which name keyboard input. It never sets prose, labels, or metadata.

## Layout

Public pages sit in a wrap of at most 1360px with a fluid gutter. Composition is deliberately uneven, and equal rows of cards are not the default.

- **Masthead:** three columns at 2.5fr, 6.5fr, and 3fr holding the contents list, the title block, and the layered rail. A full-width staff closes the first viewport.
- **Learning grid:** 12 columns. The lead story takes 8 and the second takes 4. Later stories repeat a three-row rhythm of 5 and 7, then 4, 4, and 4, and these lighter slots start from a 2px ink rule instead of a card.
- **Paired sections:** uneven splits of 7 to 5 and 4 to 8. The Liu's Book band runs full-bleed in Deep Blush.
- **Reading columns:** 720px for posts, 680px for story pages, 660px for chapters.
- **Rhythm:** sections are separated by the section spacing token, and the band adds its own vertical padding. The sticky header is 68px tall, and anchors stop 88px from the top.
- **Responsive:** at 1080px the nav collapses behind a 44px toggle and the masthead becomes two columns with the contents list below. At 720px everything is one column and tap targets on public pages and form actions reach 44px. At any width, the Moments staff scrolls sideways inside its own frame rather than moving the page.

### Named Rules
**The Staff Rule.** A staff is always five parallel, evenly spaced lines, whatever the scale: 6px spacing on covers and in the footer, 20px on the Moments timeline. A note on a staff always stands for something real: a bit, a word of a title, or a published item.

## Elevation & Depth

Depth is a hybrid of tonal layering and paper. Pink fields step apart by tone with no shadow, while paper objects lift off them with soft, wine-tinted shadows, and rotation does as much as shadow to make them feel placed.

### Shadow Vocabulary
- **Paper** (`box-shadow: 0 1px 2px rgba(67, 24, 44, .06), 0 10px 24px -14px rgba(67, 24, 44, .22)`): cards, quotes, mascot stickers, and the back-to-top button at rest.
- **Lift** (`box-shadow: 0 2px 4px rgba(67, 24, 44, .07), 0 20px 36px -18px rgba(67, 24, 44, .32)`): the Now Playing panel, the piano, the lead image, and hovered cards and covers.
- **Shelf cast** (`box-shadow: 0 16px 18px -14px rgba(67, 24, 44, .4)`): under the shelf board only.
- **Book hinge** (`box-shadow: inset 7px 0 0 rgba(67, 24, 44, .18)`): the darker hinge band along a cover's spine. It depicts the book's construction, so it stays inside covers.

### Named Rules
**The Placed Paper Rule.** Paper layers tilt by no more than 1.2deg; mascot stickers may tilt 4deg to 5deg. Layers overlap by small negative margins, so they read as stacked by hand.

**The Quiet Page Rule.** Post, chapter, Admin, and editor pages are flat. They carry no rotation or decoration in the reading or working area, and the cursor effect does not run on posts, chapters, Admin, or the editor.

## Shapes

Corners stay small on paper, so it still looks like paper, and go fully round on anything you press. Tight 4px corners sit on inset images and bars, paper uses 6px, instrument and empty-state frames use 8px, form fields 10px, and code blocks 12px. Buttons, chips, tags, and search are full pills. Mascot stickers use a generous 22px corner with a 6px paper border (16px and 4px under 720px), and the Liu's Book mascot is a white-bordered print with a thicker bottom edge.

Book covers are the one asymmetric shape: 3px at the spine and 7px at the fore-edge, with a thin inset frame at 35% opacity. Horizontal rules do most of the structural work: 1px Hairline Pink for lists, 2px ink to open a story slot or close a page heading, and a 10px Dusty Rose board for shelves. The `.empty` state, used in Little Moments, in search, and in a story with no chapters, has a 1px dashed Dusty Rose outline. The empty reading shelf is a composed board with the shelf names standing on it, and empty sections on a filled shelf are plain muted text.

Line art shares one stroke: thin, round-capped, and coloured by `currentColor`. Interface icons are Lucide at a 1.5 stroke.

## Components

### Buttons
Soft pills that lift a single pixel.
- **Shape:** full pill (999px), at least 46px tall.
- **Primary:** Wine Ink fill with paper text.
- **Hover / Focus:** Primary shifts to Peony Wine and rises 1px. Focus everywhere is a 2px Peony Wine outline offset 3px, switching to paper colour on dark panels.
- **Ghost:** transparent with a Dusty Rose border and ink text; hover fills Deep Blush and darkens the border to Peony Wine.
- **Link:** text-only Peony Wine action, or Danger for destructive ones.

### Chips
- **Style:** transparent pill with a Dusty Rose border, 40px tall (44px under 720px), and a small computed count beside the label.
- **State:** hover fills Deep Blush; selected turns Wine Ink with paper text. Topic links follow the same pattern.

### Tags
- **Style:** a small Petal pill with ink text. Linked tags invert to Wine Ink on hover.

### Cards / Containers
- **Corner Style:** 6px.
- **Background:** Pink-White Paper by default. The second story uses Deep Blush so it doesn't echo the lead. When it is the last story, between 721px and 1080px it runs the full row with its cover beside the text.
- **Shadow Strategy:** Paper at rest, Lift on hover.
- **Border:** none.
- **Internal Padding:** 26px 28px 24px on post cards, fluid up to 44px on the lead story.

Stories without an image get a staff written from their title, one note per word, on a pink field.
- **Story images:** the lead and second cards never let an image set the row height: the image fills its cover field absolutely with `object-fit: cover`. Only the lead image tilts, and only it reacts to hover. At 720px and below both cover fields hold a 3:2 ratio, and a title staff with no image takes a 132px field instead.

### Inputs / Fields
- **Style:** Pink-White Paper with a 1px Field Line stroke. Search is a 46px pill; form fields use a 10px corner.
- **Focus:** a 2px Peony Wine outline.
- **Error / Disabled:** errors are 14px Danger text; disabled controls drop to 60% opacity.

### Navigation
- **Style:** Literata 16px ink links in a sticky 68px header on the page ground, closed by a 1px hairline. The OJM wordmark is Noto Serif Display 600 with wide tracking beside a treble clef.
- **States:** a 2px Peony Wine underline wipes in from the left on hover and for the current page.
- **Mobile:** below 1080px, links open as a stacked 18px panel of 48px rows under a menu toggle.

### Book Cover
A cloth-bound book built from real titles. The colour comes from the cloth tokens and the weave from `public/textures/cloth.png`, a procedural 256px seamless overlay with a transparent ground that sits on any background colour. Story covers carry the title, a small staff, and a computed chapter count; reading-shelf covers carry the title alone. Linked covers rise 10px on hover and take the Lift shadow. On the home shelf they stand at varied heights on a 10px board. The title stays in the flow and is clamped to 5 lines, so the chapter count at the foot always shows, even for a 200-character title. The staff ornament between them absorbs the remaining height.

### Now Playing
A Wine Ink panel tilted -1.2deg, topped by a white eight-key piano strip, one key for each note of the scale, that lights the current key in Peony Wine. It names what is playing in a live region, with a Daily Quote paper card overlapping below it.

### Staff Timeline
Little Moments plots each post or story as a real note on a 20px staff. Filled notes are posts, hollow notes are stories, and height comes from the data. During playback the active note scales up and its title turns Peony Wine.

### Piano
An eight-key one-octave instrument in a Wine Ink case. Keys are Pink-White Paper, hover Soft Blush, and press to Petal, and they answer to pointer, touch, and keyboard. Black keys are decorative.

### Draft Notice
Editors autosave to the browser. A Deep Blush strip reports a restored draft and offers to discard it; one small line below reports whether a draft is saved or the browser refused it. Errors keep the error colour. The only interruptions are a confirmation before discarding a draft and one before leaving with unsaved changes, and that second one says plainly when the browser could not keep the draft. If another tab is writing the same draft, an error line says so until that tab saves or discards it; drafts are never merged.

### Motion
Most motion shares one ease, `cubic-bezier(.16, 1, .3, 1)`, with state changes of about .2s to .45s and one-time entrances of about .5s to .9s. Piano keys answer faster, at about .1s.

**The Stillness Rule.** There is no continuous animation. Every movement answers an event (load, scroll into view, hover, pointer movement, or playback) and then stops, and `prefers-reduced-motion` turns it off.

## Known Gaps

Facts about the shipped build, recorded so they are not read as rules.

- The type ramp above names the voices, not every size. About 56 fixed sizes sit outside it, in public pages as well as Admin: Markdown headings at 34, 29, and 23px, `.post-card h3` at 25px, `.ledger h3` at 20px, and label steps at 13, 13.5, 14, 14.5, and 15px. Those five label steps are close enough to merge later.
- Radii outside the scale sit on real objects: 2px, 3px and 7px on covers, 5px on code and keys, 16px on the small sticker, and 50% on round notes and buttons.
- The detector's side-tab warning on `.cover` is a false positive: the inset band is the book hinge, not an accent stripe.
- `.brand` is set in Display at 27px and is accepted as about 28px.
- Below 1080px the hero drops the violin and code marks, and at 390px the bit staff is cropped.
- Hero staff notes light by beat, not by pitch.
- The native date-picker icon stays browser chrome at 70% opacity, accepted as a browser surface.
- Browser Back has no leave warning. The draft is still saved on the way out.

## Do's and Don'ts

### Do:
- **Do** use a five-line staff wherever a rule needs to feel like OJM.
- **Do** keep Noto Serif Display at about 28px and up, and switch to Literata below that.
- **Do** tie every note on a staff to a real bit, word, or published item.
- **Do** keep paper tilt at 1.2deg or less, and use the Paper and Lift shadows rather than new ones.
- **Do** cycle covers through the four cloth tokens, with the cloth overlay on top.
- **Do** keep tap targets at 44px or more on small public screens.
- **Do** drop rotation and ornament on reading and Admin pages.
- **Do** check Admin pages when changing a shared token.

### Don't:
- **Don't** add a dark theme, or make dark brown or ivory the main colour.
- **Don't** use loud gradients. Staff lines drawn with a hard-stop repeating gradient and the violin's faint body tint are part of the world.
- **Don't** use heavy glassmorphism.
- **Don't** add continuous animation, including idle loops, marquees, or autoplay.
- **Don't** set readable text in Dusty Rose.
- **Don't** use JetBrains Mono for prose, labels, or metadata.
- **Don't** rename shared tokens such as `--pink-soft` or `--rose-ink` without updating Admin.

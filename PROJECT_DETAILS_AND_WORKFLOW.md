# Top 10 Political Leaders of India

## Purpose

This project is an educational, informational website that presents the journeys,
major events, quotes, and development contributions of ten Indian political
leaders. The website is designed as a simple static front-end project and does
not require a server-side application or database.

This file is documentation only. It does not load in the website and does not
change the behavior of any existing page.

## Technology Used

### Frontend

- **HTML5**: Defines the structure of the Home, Leaders, About, and Contact pages.
- **CSS3**: Provides the layout, colors, responsive grid, cards, buttons, modal,
  navigation, form styling, and hover effects.
- **Vanilla JavaScript**: Adds dynamic leader rendering, search, category
  filtering, modal details, and click event handling without using a framework.
- **JSON**: Stores the leader information separately from the page structure.
- **Google Fonts (Poppins)**: Used through a remote stylesheet for the visual
  typography.
- **Local image files**: Leader portraits and event images are stored in the
  `images` folder.

### Backend and data storage

There is currently **no backend service, API server, or database**. The project
is a client-side static website. Leader information is read from
`js/data.json` by the browser.

The Contact page uses a `mailto:` form action. This opens the visitor's email
client rather than sending data through a custom backend.

## Project Structure

```text
.
├── index.html             # Home page
├── leaders.html           # Searchable and filterable leader listing
├── about.html             # Project description
├── contact.html           # Contact form
├── css/
│   └── style.css          # Shared visual styling
├── js/
│   ├── data.json          # Leader and event content
│   └── script.js          # Dynamic page behavior
├── images/                # Portrait and event images
└── PROJECT_DETAILS_AND_WORKFLOW.md
```

## How Each Tool Is Used

### HTML

HTML creates the page sections and provides shared navigation between the four
pages. The Leaders page contains the search field, category buttons, leader
grid, and modal container that JavaScript fills at runtime.

### CSS

The shared stylesheet keeps the visual design consistent across all pages. It
defines the Indian-flag-inspired orange, green, and navy color palette, creates
the responsive leader-card grid, and controls the hidden/visible state of the
details modal through the `.active` class.

### JavaScript

The script runs after the DOM has loaded. It:

1. Fetches `js/data.json`.
2. Stores the returned array in memory.
3. Renders one card for each leader.
4. Filters cards as the user types a leader name.
5. Filters cards by category when a filter button is selected.
6. Finds the selected leader when a “View Details” button is clicked.
7. Builds and opens a modal containing the portrait, biography, quote, events,
   development works, and a Wikipedia link.
8. Closes the modal when the close button or overlay is clicked.

### JSON

Each leader record contains an ID, name, image filename, category, life period,
biography, quote, Wikipedia link, event records, and development points. Event
records contain their own name, image, and external link. This makes it
possible to add or update content without changing the rendering logic.

## Overall User Workflow

1. A visitor opens `index.html`.
2. The Home page introduces the topic and links to the Leaders page.
3. The Leaders page loads the data file and displays the leader cards.
4. The visitor can search by name or choose a category:
   - All
   - Freedom Fighters
   - Prime Ministers
   - Social Reformers
5. The visitor selects “View Details” on a card.
6. JavaScript opens a modal with expanded information and event links.
7. The visitor can follow the Wikipedia links for additional reading.
8. The About page explains the purpose of the project.
9. The Contact page allows the visitor to prepare a message through their
   default email application.

## Content Update Workflow

To add or update a leader:

1. Add or edit a record in `js/data.json`.
2. Put any referenced images in the `images` folder.
3. Ensure the image filenames and category values match the expected names.
4. Open the Leaders page through a local web server and check the card,
   search, filter, and modal behavior.
5. Verify that external links open the intended reference pages.

No JavaScript change is normally required for content-only updates.

## Problems Encountered and How They Were Addressed

The following points are based on the implementation currently present in the
repository.

### Keeping content separate from page markup

Hard-coding every leader card in HTML would make the page difficult to update.
The project addresses this by storing leader content in `js/data.json` and
generating cards dynamically with JavaScript.

### Supporting search and category filtering together with a small codebase

The project uses one in-memory `allLeaders` array and re-renders the grid after
each search or filter action. Event delegation is used for filter buttons and
card buttons, which keeps the number of event listeners small.

### Showing detailed information without creating many pages

Instead of creating a separate HTML page for every leader, the project uses a
modal overlay. The selected leader's data is inserted into the modal only when
the visitor requests it.

### Handling image display differences

Leader images can have different dimensions and orientations. The stylesheet
uses fixed card dimensions with `object-fit: contain` and a light background so
that the image remains visible without being unnecessarily cropped.

### Making the interface usable on different screen sizes

The leader grid uses `auto-fit` and `minmax`, while the controls can wrap.
This allows the layout to adapt to desktop and smaller screens without a
front-end framework.

### Running the JSON fetch locally

Because the Leaders page loads data with `fetch`, opening the HTML file directly
with a `file://` URL may be restricted by browser security rules. Running a
small local static server avoids that issue and more closely matches normal
website hosting.

## Current Limitations

- The project has no persistent backend or database.
- The Contact form depends on the visitor's local email client and uses a
  placeholder email address that should be replaced before production use.
- The data file and image paths must be available when the page is hosted.
- External Google Fonts and Wikipedia links require internet access.
- There is no automated test suite, content-management interface, or admin
  panel.
- The JavaScript inserts trusted project data into HTML. If content becomes
  user-editable in the future, input sanitization should be added.

## Future Enhancements

1. Add a real contact endpoint or a serverless form service with validation and
   spam protection.
2. Add responsive navigation for very small screens.
3. Add keyboard focus management and Escape-key support for the modal.
4. Add accessible labels, focus states, and improved screen-reader semantics.
5. Add pagination, sorting, or a timeline view as the content grows.
6. Add a content management system or protected admin workflow for maintaining
   leader data.
7. Replace external font dependence with a locally hosted or fallback-first
   font strategy.
8. Add automated HTML, CSS, JavaScript, accessibility, and link checks.
9. Add optimized image formats, lazy loading, and responsive image sizes.
10. Add deployment automation using a static hosting platform such as GitHub
    Pages, Netlify, or Azure Static Web Apps.
11. Add citations and source metadata for each biography, event, and
    development entry to strengthen educational reliability.

## Suggested Verification Checklist

- All four HTML pages open correctly.
- Navigation links reach the intended pages.
- The Leaders page renders records from `js/data.json`.
- Search returns matching leader names and shows a no-results message when
  appropriate.
- Each category button returns the expected group.
- Every “View Details” button opens the correct modal.
- The modal close button and overlay close behavior work.
- Portraits and event images load without broken paths.
- External links open in a new tab.
- The Contact page opens the default mail client when submitted.
- The layout remains readable on desktop and mobile-sized screens.


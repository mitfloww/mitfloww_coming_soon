# QA report: MitFloww social media bundle

**Result: every automated check in `QA-CHECKS.md` passed**, and both contact sheets were inspected visually.

## Deliverables

| | Horizontal | Vertical | Total |
|---|---|---|---|
| SVG (vector) | 4 | 4 | 8 |
| PDF (vector) | 4 | 4 | 8 |
| Transparent PNG (1080 / 2048 / 4096 wide) | 12 | 12 | 24 |
| Ready-to-post PNG 1080×1080 | 4 | 4 | 8 |

## Checks

**Exact v2 artwork**
- Every SVG's icon paths and 9 wordmark shapes are identical to the delivered `MitFloww-Logo-Bundle-v2` lockups.
- The viewBox and placement transforms are also identical, so nothing is redrawn, resized or re-spaced.

**Colours**

| Version | Icon | Wordmark |
|---|---|---|
| Full black | `#000000` only | `#000000` only |
| Full white | `#FFFFFF` only | `#FFFFFF` only |
| Brand icon + white wordmark | `#005BDD` / `#00C7FF` | `#FFFFFF` |
| Brand icon + black wordmark | `#005BDD` / `#00C7FF` | `#000000` |

These checks apply to the SVG fills, the PDF vector fills, and every fully opaque pixel of the PNGs.

**PDF**
- One page, vector only, with 12 filled paths and no images.
- Same aspect ratio as the SVG.

**Transparent PNG**
- RGBA at the exact sizes, with a transparent background.
- Nothing touches the image edge, so nothing is clipped.

**Ready-to-post**
- Each file is 1080×1080, with the correct solid background (white or navy `#001233`).
- The logo sits inside the circular profile-crop safe zone. The furthest logo pixel is 425.7 px (horizontal) or 424.2 px (vertical) from the centre, within the 432 px limit.
- The logo is centred to within 0.5 px.

**Visual inspection**
- Every variant was checked on white, grey, navy and transparent backgrounds, and every ready-to-post square was checked with the circular crop overlaid.
- Separation, colours and centring are correct.
- The low-contrast cells (white on white, black on navy) are intentional demonstrations.

## Notes

- The wordmark colours follow the request literally: versions 3 and 4 have an entirely white or entirely black wordmark, including the i-dot.
- Navy `#001233` (the background for the light-coloured squares) is the v2 wordmark colour.
- No issues were found.

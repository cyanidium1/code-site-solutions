"use client";

// Wrapper whose ONLY job is to co-locate the lightbox stylesheet with the
// lightbox JS. Importing the CSS here (instead of at the top of
// efedra-case-gallery) puts it inside the dynamic-import boundary, so both the
// ~5.6 KB stylesheet and the library load together as a lazy chunk when a tile
// is opened — off the render-blocking path of every page that renders a gallery.
import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";

export default Lightbox;

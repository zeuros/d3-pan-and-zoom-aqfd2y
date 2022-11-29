import * as d3 from 'd3';

import './style.css';

const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 400;

function zoomed(evt) {
  const svg = d3.select('svg');
  const wrapper = d3.select('#wrapper').node();
  const scale = evt.transform.k;

  const scaledWidth = IMAGE_WIDTH * scale;
  const scaledHeight = IMAGE_HEIGHT * scale;

  // Change SVG dimensions.
  svg.attr('width', scaledWidth).attr('height', scaledHeight);

  // Scale the image itself.
  svg.select('g').attr('transform', `scale(${scale})`);

  // Move scrollbars.
  wrapper.scrollLeft = -evt.transform.x;
  wrapper.scrollTop = -evt.transform.y;

  // If the image is smaller than the wrapper, move the image towards the
  // center of the wrapper.
  const dx = d3.max([0, wrapper.clientWidth / 2 - scaledWidth / 2]);
  const dy = d3.max([0, wrapper.clientHeight / 2 - scaledHeight / 2]);
  d3.select('svg').attr('transform', `translate(${dx}, ${dy})`);
}

function scrolled() {
  const wrapper = d3.select('#wrapper');
  const x = wrapper.node().scrollLeft + wrapper.node().clientWidth / 2;
  const y = wrapper.node().scrollTop + wrapper.node().clientHeight / 2;
  const scale = d3.zoomTransform(wrapper.node()).k;
  // Update zoom parameters based on scrollbar positions.
  wrapper.call(d3.zoom().translateTo, x / scale, y / scale);
}

// Set initial SVG dimensions.
d3.select('svg').attr('width', IMAGE_WIDTH).attr('height', IMAGE_HEIGHT);

// Set up d3-zoom and callbacks.
d3.select('#wrapper')
  .on('scroll', scrolled)
  .call(
    d3
      .zoom()
      .scaleExtent([0.1, 10])
      .translateExtent([
        [0, 0],
        [IMAGE_WIDTH, IMAGE_HEIGHT],
      ])
      .on('zoom', zoomed)
  );

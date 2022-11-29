import * as d3 from 'd3';

import './style.css';

const zoomed = (wrapper, svg) => (evt) => {
  const scale = evt.transform.k;
  const scaledWidth = IMAGE_WIDTH * scale;
  const scaledHeight = IMAGE_HEIGHT * scale;

  // Change SVG dimensions.
  svg
    .attr('viewBox', `${0} ${0} ${scaledWidth} ${scaledHeight}`)
    .attr('width', scaledWidth)
    .attr('height', scaledHeight);

  // Scale the image itself.
  svg.select('g').attr('transform', `scale(${scale})`);

  // Move scrollbars.
  wrapper.node().scrollLeft = -evt.transform.x;
  wrapper.node().scrollTop = -evt.transform.y;

  // If the image is smaller than the wrapper, move the image towards the
  // center of the wrapper.
  const dx = d3.max([0, wrapper.node().clientWidth / 2 - scaledWidth / 2]);
  const dy = d3.max([0, wrapper.node().clientHeight / 2 - scaledHeight / 2]);
  svg.attr('transform', `translate(${dx}, ${dy})`);
};

const scrolled = (wrapper) => (evt) => {
  const x = wrapper.node().scrollLeft + wrapper.node().clientWidth / 2;
  const y = wrapper.node().scrollTop + wrapper.node().clientHeight / 2;
  const scale = d3.zoomTransform(wrapper.node()).k;
  // Update zoom parameters based on scrollbar positions.
  wrapper.call(d3.zoom().translateTo, x / scale, y / scale);
};

const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 400;
const wrapper = d3.select('#wrapper');
const svg = d3.select('svg');

// Set initial SVG dimensions.
svg
  .attr('viewBox', `${0} ${0} ${IMAGE_WIDTH} ${IMAGE_HEIGHT}`)
  .attr('width', IMAGE_WIDTH)
  .attr('height', IMAGE_HEIGHT);

// Set up d3-zoom and callbacks.
d3.select('#wrapper')
  .on('scroll', scrolled(wrapper))
  .call(
    d3
      .zoom()
      .scaleExtent([0.1, 10])
      .translateExtent([
        [0, 0],
        [IMAGE_WIDTH, IMAGE_HEIGHT],
      ])
      .on('zoom', zoomed(wrapper, svg))
  );

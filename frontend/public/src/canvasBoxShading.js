function drawStripe(context, startx, starty, endx, endy) {
  context.beginPath();
  context.strokeStyle = 'white';
  context.lineWidth = 2;
  context.lineCap = 'round';
  context.moveTo(startx, starty);
  context.lineTo(endx, endy);
  context.stroke();
}

function fillStripes(context, x, y, width, height) {
  let starty = y;
  let endx = x;
  let startx = x;
  let endy = y;

  const gap = 5;

  do {
    starty += gap;
    endx += gap;
    drawStripe(context, startx, starty, endx, endy);
  } while (starty < height + y && endx + 5 < width + x);

  if (width > height) {
    endx = height + x;

    do {
      starty = height + y;
      startx += gap;
      endx += gap;
      drawStripe(context, startx, starty, endx, endy);
    } while (endx + gap < width + x);

    endx = x + width;
    endy = y - gap;
    starty = y + height;

    do {
      startx += gap;
      endy += gap;
      drawStripe(context, startx, starty, endx, endy);
    } while (endy + gap < height + y);
  }

  if (height > width) {
    endx = width + x;
    endy = y - gap;
    startx = x;
    starty = width + y - gap;

    do {
      starty += gap;
      endy += gap;
      drawStripe(context, startx, starty, endx, endy);
    } while (starty + gap < height + y);

    starty = y + height - gap;
    startx = x;
    endx = x + width;

    do {
      startx += gap;
      endy += gap;
      drawStripe(context, startx, starty, endx, endy);
    } while (startx + gap < width + x);
  }
}

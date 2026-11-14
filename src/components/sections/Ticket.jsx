import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Section, Container, GridBackdrop, Eyebrow } from '../ui/primitives';
import { reservedNumber } from './ticketRoster';

/**
 * Meteora Hacker House ticket maker for UBC 2026.
 *
 * The ticket is drawn straight onto a <canvas>, so the preview on screen and
 * the exported PNG are the same pixels. Everything runs in the browser: the
 * photo never leaves the device.
 */

const EXPORT_SCALE = 2;
const FORMATS = {
  x: { label: 'X / Twitter', width: 1200, height: 675 },
  linkedin: { label: 'LinkedIn', width: 1200, height: 1200 },
};

const PALETTES = {
  light: {
    backdrop: '#EEEDF4',
    card: '#FFFFFF',
    ink: '#0E0D17',
    muted: '#5B5873',
    faint: '#8A879E',
    hairline: '#D9D7E4',
    photoFill: '#E9E8F0',
    silhouette: '#CFCDDD',
    wordmark: '#1F1A4D',
  },
  dark: {
    backdrop: '#0B0A12',
    card: '#17161F',
    ink: '#FFFFFF',
    muted: 'rgba(255, 255, 255, 0.66)',
    faint: 'rgba(255, 255, 255, 0.42)',
    hairline: 'rgba(255, 255, 255, 0.16)',
    photoFill: '#24232F',
    silhouette: '#3B3A4A',
    wordmark: '#FFFFFF',
  },
};

const METEORA_STOPS = [
  [0, '#F5BD00'],
  [0.365, '#F54B00'],
  [1, '#6E45FF'],
];

/* Meteora mark, 34x34 viewBox, from their brand kit. */
const METEORA_MARK =
  'M25.9321 9.62981C26.3919 9.17001 27.1044 9.19668 27.3989 9.68352C27.7174 10.2064 27.9581 10.7713 28.1294 11.3632C28.2255 11.6997 28.1139 12.0935 27.8345 12.373L18.8276 21.3798C18.2837 21.9237 17.6074 22.2998 16.8892 22.4531L16.1411 22.6122C15.4259 22.7685 14.7435 23.1436 14.2026 23.6845L7.2876 30.5995C6.99316 29.4638 6.86427 28.6978 7.78662 27.7753L25.9321 9.62981ZM27.8833 13.5097C28.1838 13.2095 28.6458 13.3836 28.6157 13.7802C28.4294 16.2083 27.2728 18.7656 25.2114 20.8271C23.6397 22.549 19.2042 25.1822 16.0337 26.9462C15.3846 27.3068 14.8555 26.5377 15.3872 26.0058L27.8794 13.5126L27.8833 13.5097ZM23.7388 5.98724C24.0242 5.70215 24.4445 5.64176 24.7329 5.83977C25.334 6.24849 25.8956 6.84133 26.1841 7.55657C26.2922 7.83303 26.1998 8.17271 25.9624 8.41009L16.2612 18.1103C15.7173 18.6542 15.041 19.0303 14.3228 19.1835L13.5747 19.3427C12.8595 19.499 12.1772 19.875 11.6362 20.4159L5.65283 26.3993C5.35832 25.2634 5.49976 24.2262 6.42236 23.3036L23.7388 5.98724ZM19.6274 4.26263C20.1684 3.72191 20.9436 3.51151 21.5806 3.75188C21.98 3.90507 22.3646 4.09124 22.728 4.31048C23.2089 4.59898 23.2335 5.30305 22.7827 5.75384L13.9106 14.6249C13.4029 15.1325 12.7122 15.4033 12.0513 15.3554C11.3571 15.3043 10.6263 15.5899 10.0884 16.1279L5.229 20.9872C4.9345 19.8513 5.31623 18.5739 6.23877 17.6513L19.6274 4.26263ZM18.2056 3.40032C18.6323 3.39431 18.7977 3.90193 18.4731 4.22649L13.8667 8.83392L9.04346 13.6572C9.04045 13.6602 9.03955 13.6601 9.03955 13.6601L7.54639 15.1533C7.23384 15.4658 6.7715 15.1837 6.9458 14.787L8.3999 11.4814C8.48104 11.28 8.57124 11.0755 8.67041 10.8681L8.6792 10.8476C9.51761 9.07159 10.8671 7.18708 12.1353 5.91888C14.1697 3.88445 15.9969 3.42141 18.2056 3.40032Z';

const CLUB_LOGO_URL = '/images/logos/boiler_blockchain_logo_svg.webp';
const CANVAS_FONTS = [
  '400 16px Inter',
  '500 16px Inter',
  '600 16px Inter',
  '500 16px Tomorrow',
  '600 16px Tomorrow',
];

const CARD = { x: 80, width: 1040, height: 462, radius: 22, stubX: 860 };
const PHOTO = { x: 136, offsetY: 54, size: 156, radius: 18 };

const randomNumber = () => 100 + Math.floor(Math.random() * 900);
const formatNumber = (number) => String(number).padStart(3, '0');
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

/** Cover-fit size of the photo inside its square, and how far it can pan. */
function photoGeometry(image, zoom) {
  const scale = Math.max(PHOTO.size / image.width, PHOTO.size / image.height) * zoom;
  const width = image.width * scale;
  const height = image.height * scale;
  return { width, height, slackX: width - PHOTO.size, slackY: height - PHOTO.size };
}

function drawMeteoraMark(context, x, y, size) {
  context.save();
  context.translate(x, y);
  context.scale(size / 34, size / 34);
  const gradient = context.createLinearGradient(33, 3.43, 9.56, 30.53);
  METEORA_STOPS.forEach(([offset, stopColor]) => gradient.addColorStop(offset, stopColor));
  context.fillStyle = gradient;
  context.fill(new Path2D(METEORA_MARK));
  context.restore();
}

function drawText(context, text, x, y, { font, color, align = 'left', spacing = 0 }) {
  context.font = font;
  context.fillStyle = color;
  context.textAlign = align;
  context.letterSpacing = `${spacing}px`;
  context.fillText(text, x, y);
}

/** Largest font size (stepping down from `startSize`) at which `text` fits. */
function fitFontSize(context, text, weight, startSize, maxWidth) {
  let size = startSize;
  context.letterSpacing = '0px';
  do {
    context.font = `${weight} ${size}px Inter`;
    if (context.measureText(text).width <= maxWidth) break;
    size -= 2;
  } while (size > 20);
  return size;
}

function drawTicket(context, ticket) {
  const { width, height } = FORMATS[ticket.format];
  const palette = PALETTES[ticket.style];
  const isSquare = height > 900;
  const headerY = isSquare ? 104 : 72;
  const cardY = isSquare ? 523 : 132;
  const mono = (size, weight = 500) => `${weight} ${size}px Tomorrow`;
  const sans = (size, weight = 600) => `${weight} ${size}px Inter`;

  context.textBaseline = 'alphabetic';
  context.fillStyle = palette.backdrop;
  context.fillRect(0, 0, width, height);

  /* Header: Meteora lockup, club badge, event tag. */
  drawMeteoraMark(context, CARD.x - 6, headerY - 24, 48);
  drawText(context, 'Meteora', CARD.x + 44, headerY + 12, {
    font: sans(35),
    color: palette.wordmark,
    spacing: -0.8,
  });
  const wordmarkEnd = CARD.x + 44 + context.measureText('Meteora').width;
  context.fillStyle = palette.hairline;
  context.fillRect(wordmarkEnd + 20, headerY - 22, 1.5, 44);
  if (ticket.clubLogo) {
    context.drawImage(ticket.clubLogo, wordmarkEnd + 40, headerY - 27, 54, 54);
  }
  drawText(context, 'UBC 2026 · AUSTIN, TX', CARD.x + CARD.width, headerY + 5, {
    font: mono(14),
    color: palette.muted,
    align: 'right',
    spacing: 3,
  });

  if (isSquare) {
    drawText(context, 'University Blockchain', CARD.x, 367, {
      font: sans(84),
      color: palette.ink,
      spacing: -2.5,
    });
    drawText(context, 'Conference 2026', CARD.x, 459, {
      font: sans(84),
      color: palette.ink,
      spacing: -2.5,
    });
  }

  /* Card body with a soft shadow, then the gradient edge clipped to it. */
  context.save();
  context.shadowColor = ticket.style === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(30, 20, 80, 0.14)';
  context.shadowBlur = 40;
  context.shadowOffsetY = 14;
  context.fillStyle = palette.card;
  context.beginPath();
  context.roundRect(CARD.x, cardY, CARD.width, CARD.height, CARD.radius);
  context.fill();
  context.restore();

  context.save();
  context.beginPath();
  context.roundRect(CARD.x, cardY, CARD.width, CARD.height, CARD.radius);
  context.clip();
  const edge = context.createLinearGradient(CARD.x, 0, CARD.x + CARD.width, 0);
  METEORA_STOPS.forEach(([offset, stopColor]) => edge.addColorStop(offset, stopColor));
  context.fillStyle = edge;
  context.fillRect(CARD.x, cardY, CARD.width, 4);
  context.restore();

  /* Perforation: dashed tear line and two notches punched out of the card. */
  context.save();
  context.strokeStyle = palette.hairline;
  context.lineWidth = 1.5;
  context.setLineDash([6, 6]);
  context.beginPath();
  context.moveTo(CARD.stubX, cardY + 24);
  context.lineTo(CARD.stubX, cardY + CARD.height - 24);
  context.stroke();
  context.restore();
  context.fillStyle = palette.backdrop;
  [cardY, cardY + CARD.height].forEach((notchY) => {
    context.beginPath();
    context.arc(CARD.stubX, notchY, 16, 0, Math.PI * 2);
    context.fill();
  });

  /* Photo, cover-fit and pannable, or a placeholder silhouette. */
  const photoY = cardY + PHOTO.offsetY;
  context.save();
  context.beginPath();
  context.roundRect(PHOTO.x, photoY, PHOTO.size, PHOTO.size, PHOTO.radius);
  context.clip();
  context.fillStyle = palette.photoFill;
  context.fillRect(PHOTO.x, photoY, PHOTO.size, PHOTO.size);
  if (ticket.photo) {
    const geometry = photoGeometry(ticket.photo, ticket.zoom);
    context.drawImage(
      ticket.photo,
      PHOTO.x - (geometry.slackX / 2) * (1 + ticket.panX),
      photoY - (geometry.slackY / 2) * (1 + ticket.panY),
      geometry.width,
      geometry.height,
    );
  } else {
    context.fillStyle = palette.silhouette;
    context.beginPath();
    context.arc(PHOTO.x + PHOTO.size / 2, photoY + 62, 27, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(PHOTO.x + PHOTO.size / 2, photoY + 168, 58, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();

  /* Identity block. */
  const textX = PHOTO.x + PHOTO.size + 30;
  const textWidth = CARD.stubX - textX - 36;
  context.fillStyle = '#F5A300';
  context.beginPath();
  context.arc(textX + 4, cardY + 92, 4, 0, Math.PI * 2);
  context.fill();
  drawText(context, 'ADMIT ONE · BUILDER', textX + 18, cardY + 97, {
    font: mono(13),
    color: palette.muted,
    spacing: 3,
  });
  const name = ticket.name.trim() || 'Your Name';
  const nameSize = fitFontSize(context, name, 600, 46, textWidth);
  drawText(context, name, textX, cardY + 150, {
    font: sans(nameSize),
    color: palette.ink,
    spacing: -1,
  });
  const handle = ticket.handle.trim().replace(/^@*/, '');
  const affiliation = 'Boiler Blockchain, Purdue University';
  const subtitle = handle ? `@${handle} · ${affiliation}` : affiliation;
  drawText(context, subtitle, textX, cardY + 186, {
    font: sans(fitFontSize(context, subtitle, 400, 18, textWidth), 400),
    color: palette.muted,
  });

  drawText(context, 'I’m in the Meteora', PHOTO.x, cardY + 278, {
    font: sans(50),
    color: palette.ink,
    spacing: -1.4,
  });
  drawText(context, 'Hacker House', PHOTO.x, cardY + 332, {
    font: sans(50),
    color: palette.ink,
    spacing: -1.4,
  });

  [
    ['EVENT', 'University Blockchain Conference 2026', PHOTO.x],
    ['DATES', 'Nov 20–21, 2026', PHOTO.x + 352],
    ['VENUE', 'UT Austin, Texas', PHOTO.x + 520],
  ].forEach(([label, value, x]) => {
    drawText(context, label, x, cardY + 384, { font: mono(11), color: palette.faint, spacing: 2.5 });
    drawText(context, value, x, cardY + 408, { font: sans(16, 500), color: palette.ink });
  });

  /* Stub. */
  const stubCenter = (CARD.stubX + CARD.x + CARD.width) / 2;
  drawMeteoraMark(context, stubCenter - 62, cardY + 52, 124);
  drawText(context, 'TICKET', stubCenter, cardY + 274, {
    font: mono(12),
    color: palette.faint,
    align: 'center',
    spacing: 3,
  });
  drawText(context, `Nº ${formatNumber(ticket.number)}`, stubCenter, cardY + 318, {
    font: mono(38, 600),
    color: palette.ink,
    align: 'center',
    spacing: 2,
  });
  drawText(context, 'NOV 20–21', stubCenter, cardY + 408, {
    font: mono(12),
    color: palette.faint,
    align: 'center',
    spacing: 3,
  });

  drawText(context, '#UBC2026 · #MeteoraHackerHouse', CARD.x, height - 40, {
    font: mono(13),
    color: palette.faint,
    spacing: 1,
  });
}

const CAPTION =
  'I’m in the Meteora Hacker House with Boiler Blockchain at University Blockchain Conference 2026. Nov 20–21, UT Austin. See you there.\n\n#UBC2026 #MeteoraHackerHouse';

export default function Ticket() {
  const canvasRef = useRef(null);
  const dragRef = useRef(null);

  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [style, setStyle] = useState('light');
  const [format, setFormat] = useState('x');
  const [photo, setPhoto] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [walkInNumber, setWalkInNumber] = useState(randomNumber);
  const [clubLogo, setClubLogo] = useState(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  const reserved = reservedNumber(name);
  const number = reserved ?? walkInNumber;
  const { width, height } = FORMATS[format];

  useEffect(() => {
    const logo = new Image();
    logo.onload = () => setClubLogo(logo);
    logo.src = CLUB_LOGO_URL;
    /* Canvas text silently falls back to a system font unless the faces are
       loaded first; nothing else on the page may have requested them yet. */
    Promise.all(CANVAS_FONTS.map((font) => document.fonts.load(font))).finally(() =>
      setFontsReady(true),
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width * EXPORT_SCALE;
    canvas.height = height * EXPORT_SCALE;
    const context = canvas.getContext('2d');
    context.scale(EXPORT_SCALE, EXPORT_SCALE);
    drawTicket(context, {
      name,
      handle,
      style,
      format,
      number,
      photo,
      zoom,
      panX: pan.x,
      panY: pan.y,
      clubLogo,
    });
  }, [name, handle, style, format, number, photo, zoom, pan, clubLogo, fontsReady, width, height]);

  const loadPhoto = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const image = new Image();
    image.onload = () => {
      setPhoto(image);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };
    image.src = URL.createObjectURL(file);
  };

  const startDrag = (event) => {
    if (!photo) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY };
  };

  const moveDrag = (event) => {
    if (!dragRef.current || !photo) return;
    const pixelRatio = width / event.currentTarget.getBoundingClientRect().width;
    const deltaX = (event.clientX - dragRef.current.x) * pixelRatio;
    const deltaY = (event.clientY - dragRef.current.y) * pixelRatio;
    dragRef.current = { x: event.clientX, y: event.clientY };
    const { slackX, slackY } = photoGeometry(photo, zoom);
    setPan((current) => ({
      x: slackX > 0 ? clamp(current.x - (deltaX * 2) / slackX, -1, 1) : 0,
      y: slackY > 0 ? clamp(current.y - (deltaY * 2) / slackY, -1, 1) : 0,
    }));
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const download = () => {
    canvasRef.current.toBlob((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `meteora-hacker-house-${formatNumber(number)}-${format}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    }, 'image/png');
  };

  const copyCaption = async () => {
    await navigator.clipboard.writeText(CAPTION);
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 2000);
  };

  return (
    <Section $divided={false}>
      <GridBackdrop />
      <Container>
        <Head>
          <Eyebrow>UBC 2026 · Austin, TX · Nov 20–21</Eyebrow>
          <Title>
            Your <span>Hacker House</span> ticket
          </Title>
          <Lede>
            Make your Meteora Hacker House ticket for University Blockchain Conference
            2026, then post it on X or LinkedIn.
          </Lede>
        </Head>

        <Layout>
          <Preview>
            <Canvas
              ref={canvasRef}
              role="img"
              aria-label={`Meteora Hacker House ticket number ${formatNumber(number)} for ${
                name.trim() || 'you'
              }`}
              $draggable={Boolean(photo)}
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            />
            <Hint>
              {photo
                ? 'Drag the photo on the ticket to reposition it. Use the slider to zoom.'
                : 'Add a photo, then drag it on the ticket to reposition.'}
            </Hint>
          </Preview>

          <Controls>
            <Field>
              <Label htmlFor="ticket-name">Name</Label>
              <Input
                id="ticket-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="First and last name"
                maxLength={40}
                autoComplete="name"
              />
              <NumberRow>
                <NumberBadge $reserved={reserved !== null}>Nº {formatNumber(number)}</NumberBadge>
                {reserved !== null ? (
                  <NumberNote>Reserved for you on the Hacker House list.</NumberNote>
                ) : (
                  <>
                    <NumberNote>
                      {name.trim()
                        ? 'Not on the house list, so this one is random. On the list? Use your full name.'
                        : 'House members get their reserved number once the name matches.'}
                    </NumberNote>
                    <SmallButton type="button" onClick={() => setWalkInNumber(randomNumber())}>
                      Shuffle
                    </SmallButton>
                  </>
                )}
              </NumberRow>
            </Field>

            <Field>
              <Label htmlFor="ticket-handle">
                X handle <Optional>optional</Optional>
              </Label>
              <Input
                id="ticket-handle"
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
                placeholder="@yourhandle"
                maxLength={20}
                autoCapitalize="none"
                spellCheck={false}
              />
            </Field>

            <Field>
              <Label htmlFor="ticket-photo">Photo</Label>
              <Dropzone
                htmlFor="ticket-photo"
                $active={dropActive}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDropActive(true);
                }}
                onDragLeave={() => setDropActive(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDropActive(false);
                  loadPhoto(event.dataTransfer.files[0]);
                }}
              >
                <strong>{photo ? 'Change photo' : 'Choose a photo'}</strong> or drop it here
                <small>A headshot works best. It stays on your device.</small>
              </Dropzone>
              <HiddenFile
                id="ticket-photo"
                type="file"
                accept="image/*"
                onChange={(event) => loadPhoto(event.target.files[0])}
              />
              <Range
                type="range"
                aria-label="Photo zoom"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                disabled={!photo}
                onChange={(event) => setZoom(Number(event.target.value))}
              />
            </Field>

            <Split>
              <Field>
                <Label as="span">Style</Label>
                <Segmented role="group" aria-label="Style">
                  {Object.keys(PALETTES).map((key) => (
                    <Segment
                      key={key}
                      type="button"
                      aria-pressed={style === key}
                      onClick={() => setStyle(key)}
                    >
                      {key}
                    </Segment>
                  ))}
                </Segmented>
              </Field>
              <Field>
                <Label as="span">Format</Label>
                <Segmented role="group" aria-label="Format">
                  {Object.entries(FORMATS).map(([key, { label }]) => (
                    <Segment
                      key={key}
                      type="button"
                      aria-pressed={format === key}
                      onClick={() => setFormat(key)}
                    >
                      {label}
                    </Segment>
                  ))}
                </Segmented>
              </Field>
            </Split>

            <Actions>
              <Primary type="button" onClick={download}>
                Download PNG
              </Primary>
              <Secondary type="button" onClick={copyCaption}>
                {captionCopied ? 'Caption copied' : 'Copy a caption'}
              </Secondary>
              <Hint>
                {width} × {height}, exported at {width * EXPORT_SCALE} × {height * EXPORT_SCALE}
              </Hint>
            </Actions>
          </Controls>
        </Layout>
      </Container>
    </Section>
  );
}

/* Styles ------------------------------------------------------------------ */

const Head = styled.div`
  margin-bottom: ${({ theme }) => theme.space[10]};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h1};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.text};
  margin: 0 0 ${({ theme }) => theme.space[4]};

  span {
    color: ${({ theme }) => theme.color.accent};
  }
`;

const Lede = styled.p`
  font-size: ${({ theme }) => theme.fontSize.bodyLarge};
  line-height: 1.6;
  color: ${({ theme }) => theme.color.textMuted};
  max-width: ${({ theme }) => theme.layout.maxWidthText};
  margin: 0;
`;

const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[6]};
  align-items: start;

  ${({ theme }) => theme.media.lg} {
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: ${({ theme }) => theme.space[8]};
  }
`;

const Preview = styled.div`
  min-width: 0;

  ${({ theme }) => theme.media.lg} {
    position: sticky;
    top: calc(${({ theme }) => theme.layout.navHeight} + ${({ theme }) => theme.space[6]});
  }
`;

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: auto;
  max-height: 78vh;
  object-fit: contain;
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
  cursor: ${({ $draggable }) => ($draggable ? 'grab' : 'default')};
  touch-action: ${({ $draggable }) => ($draggable ? 'none' : 'auto')};

  &:active {
    cursor: ${({ $draggable }) => ($draggable ? 'grabbing' : 'default')};
  }
`;

const Hint = styled.p`
  margin: ${({ theme }) => theme.space[3]} 0 0;
  font-size: ${({ theme }) => theme.fontSize.small};
  color: ${({ theme }) => theme.color.textFaint};
`;

const Controls = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[6]};
  padding: ${({ theme }) => theme.space[6]};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
`;

const Field = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 0;
`;

const Split = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[6]};
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};
`;

const Optional = styled.span`
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.color.textFaint};
`;

const Input = styled.input`
  width: 100%;
  min-width: 0;
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[4]}`};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.black};
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: 1rem;
  transition: border-color ${({ theme }) => theme.motion.fast};

  &::placeholder {
    color: ${({ theme }) => theme.color.textFaint};
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.color.accent};
  }
`;

const NumberRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

const NumberBadge = styled.span`
  flex-shrink: 0;
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[2]}`};
  border: 1px solid
    ${({ theme, $reserved }) => ($reserved ? theme.color.accent : theme.color.borderStrong)};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.small};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $reserved }) => ($reserved ? theme.color.accentBright : theme.color.text)};
`;

const NumberNote = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSize.small};
  line-height: 1.4;
  color: ${({ theme }) => theme.color.textFaint};
`;

const SmallButton = styled.button`
  flex-shrink: 0;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.motion.fast},
              color ${({ theme }) => theme.motion.fast};

  &:hover,
  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.color.accent};
    color: ${({ theme }) => theme.color.accent};
  }
`;

const Dropzone = styled.label`
  display: block;
  padding: ${({ theme }) => `${theme.space[5]} ${theme.space[4]}`};
  border: 1px dashed
    ${({ theme, $active }) => ($active ? theme.color.accent : theme.color.borderStrong)};
  background: ${({ theme, $active }) => ($active ? theme.color.accentWash : 'transparent')};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.small};
  color: ${({ theme }) => theme.color.textMuted};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.motion.fast},
              background ${({ theme }) => theme.motion.fast};

  strong {
    color: ${({ theme }) => theme.color.text};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
  }

  small {
    display: block;
    margin-top: ${({ theme }) => theme.space[1]};
    font-size: ${({ theme }) => theme.fontSize.micro};
    color: ${({ theme }) => theme.color.textFaint};
  }

  &:hover {
    border-color: ${({ theme }) => theme.color.accent};
  }
`;

/* Visually hidden but focusable, so the dropzone label works from the keyboard. */
const HiddenFile = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;

  &:focus-visible + input,
  label:has(+ &:focus-visible) {
    border-color: ${({ theme }) => theme.color.accent};
  }
`;

const Range = styled.input`
  width: 100%;
  margin: ${({ theme }) => theme.space[2]} 0 0;
  accent-color: ${({ theme }) => theme.color.accent};
  cursor: pointer;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const Segmented = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  border: 1px solid ${({ theme }) => theme.color.border};
`;

const Segment = styled.button`
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[2]}`};
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.color.textMuted};
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.micro};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background ${({ theme }) => theme.motion.fast},
              color ${({ theme }) => theme.motion.fast};

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }

  &[aria-pressed='true'] {
    background: ${({ theme }) => theme.color.accentDeep};
    color: #ffffff;
  }

  &:focus-visible {
    outline: 1px solid ${({ theme }) => theme.color.accentBright};
    outline-offset: -3px;
  }
`;

const Actions = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  padding-top: ${({ theme }) => theme.space[6]};
  border-top: 1px solid ${({ theme }) => theme.color.border};

  ${Hint} {
    margin: 0;
    text-align: center;
    font-size: ${({ theme }) => theme.fontSize.micro};
  }
`;

const Primary = styled.button`
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.color.accentDeep};
  border-radius: ${({ theme }) => theme.radius.none};
  background: ${({ theme }) => theme.color.accentDeep};
  color: #ffffff;
  font-family: ${({ theme }) => theme.fontFamily.mono};
  font-size: ${({ theme }) => theme.fontSize.small};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background ${({ theme }) => theme.motion.base},
              border-color ${({ theme }) => theme.motion.base};

  &:hover,
  &:focus-visible {
    outline: none;
    background: ${({ theme }) => theme.color.accent};
    border-color: ${({ theme }) => theme.color.accent};
  }
`;

const Secondary = styled(Primary)`
  background: transparent;
  border-color: ${({ theme }) => theme.color.borderStrong};
  color: ${({ theme }) => theme.color.text};

  &:hover,
  &:focus-visible {
    background: transparent;
    border-color: ${({ theme }) => theme.color.accent};
    color: ${({ theme }) => theme.color.accent};
  }
`;

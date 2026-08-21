import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import { Section, Container, GridBackdrop, Eyebrow } from '../../ui/primitives';

/**
 * Counts up once, when scrolled into view.
 *
 * Respects prefers-reduced-motion by jumping straight to the final value —
 * a number ticking up is motion like any other.
 */
function CountUp({ end, duration = 1600, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return;
        hasRun.current = true;

        if (prefersReduced) {
          setCount(end);
          return;
        }

        let start = null;
        const step = (now) => {
          if (!start) start = now;
          const progress = Math.min((now - start) / duration, 1);
          // Ease out, so it decelerates into the final number.
          setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * end));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * Plain 4-up grid.
 *
 * Replaces a flex row with an absolutely positioned "chain line", per-node
 * connector elements, a 12-dot drifting network field and a background SVG node
 * graph — of which the hover interaction never fired, because the selectors
 * targeted siblings that were not siblings.
 */
const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space[8]};
  border-top: 1px solid ${({ theme }) => theme.color.border};

  ${({ theme }) => theme.media.sm} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* 4-up only at xl. At lg the columns are ~230px and the widest value
     ("$50,000+") overflows into its neighbour. */
  ${({ theme }) => theme.media.xl} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const Stat = styled.div`
  padding-block: ${({ theme }) => theme.space[8]};
  padding-inline: ${({ theme }) => theme.space[2]};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};

  ${({ theme }) => theme.media.xl} {
    border-bottom: 0;
    border-left: 1px solid ${({ theme }) => theme.color.border};
    padding-inline: ${({ theme }) => theme.space[6]};

    &:first-child {
      border-left: 0;
      padding-left: 0;
    }
  }
`;

const Value = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.stat};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 1;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.accent};
  /* Tabular figures stop the layout jittering as the digits tick over. */
  font-variant-numeric: tabular-nums;
`;

const Label = styled.div`
  margin-top: ${({ theme }) => theme.space[3]};
  font-family: ${({ theme }) => theme.fontFamily.display};
  font-size: ${({ theme }) => theme.fontSize.h4};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.color.text};
`;

const Micro = styled.div`
  margin-top: ${({ theme }) => theme.space[2]};
  font-family: ${({ theme }) => theme.fontFamily.body};
  font-size: ${({ theme }) => theme.fontSize.small};
  line-height: 1.5;
  color: ${({ theme }) => theme.color.textFaint};
`;

const stats = [
  { value: 100, suffix: '+', label: 'Weekly Active', micro: 'Members every week' },
  { value: 50000, prefix: '$', suffix: '+', label: 'In Prize Money Won', micro: 'Across global hackathons' },
  { value: 25, suffix: '+', label: 'Partners & Sponsors', micro: 'Backed by leading protocols' },
  { value: 400, suffix: '+', label: 'Students Graduated', micro: 'From the technical course' },
];

export default function Stats() {
  return (
    <Section>
      <GridBackdrop />
      <Container>
        <Eyebrow>By the numbers</Eyebrow>
        <Row>
          {stats.map((stat, index) => (
            <Stat
              key={stat.label}
              as={motion.div}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <Value>
                <CountUp
                  end={stat.value}
                  prefix={stat.prefix || ''}
                  suffix={stat.suffix || ''}
                />
              </Value>
              <Label>{stat.label}</Label>
              <Micro>{stat.micro}</Micro>
            </Stat>
          ))}
        </Row>
      </Container>
    </Section>
  );
}

'use client';

import Portfolio from './portfolio/Portfolio';

export default function PortfolioWrapper({ id }: { id?: string }) {
  return <Portfolio id={id} />;
}

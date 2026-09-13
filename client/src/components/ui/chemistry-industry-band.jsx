import { FlaskConical } from "lucide-react";
import { products } from "../../../../shared/catalog.js";
import { FlowingLogo } from "@/components/ui/logo-cloud-marquee-utils/flowing-logos";

const chemicalNames = [...new Set(products.map((product) => product.name))];

function ChemistryItem({ name }) {
  return (
    <span className="industry-band-item">
      <FlaskConical size={16} strokeWidth={1.6} aria-hidden="true" />
      {name}
      <i aria-hidden="true">✳</i>
    </span>
  );
}

export function ChemistryIndustryBand() {
  return (
    <div className="industry-band">
      <span className="industry-band-label">CHEMISTRY AT WORK</span>
      <div className="industry-band-track">
        <FlowingLogo
          className="industry-band-flow [--duration:55s] [--gap:32px]"
          pauseOnHover
          applyMask={false}
          repeat={2}
        >
          {chemicalNames.map((name) => (
            <ChemistryItem key={name} name={name} />
          ))}
        </FlowingLogo>
      </div>
    </div>
  );
}

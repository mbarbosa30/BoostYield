import { useState } from "react";
import { RiskDisclosureModal } from "../RiskDisclosureModal";
import { Button } from "@/components/ui/button";

export default function RiskDisclosureModalExample() {
  const [openSafe, setOpenSafe] = useState(false);
  const [openDegen, setOpenDegen] = useState(false);

  return (
    <div className="p-6 flex gap-4">
      <Button onClick={() => setOpenSafe(true)}>
        Show Safe Disclosure
      </Button>
      <Button variant="destructive" onClick={() => setOpenDegen(true)}>
        Show Degen Disclosure
      </Button>

      <RiskDisclosureModal
        open={openSafe}
        onOpenChange={setOpenSafe}
        type="safe"
        onAccept={() => console.log("Safe risk accepted")}
      />

      <RiskDisclosureModal
        open={openDegen}
        onOpenChange={setOpenDegen}
        type="degen"
        onAccept={() => console.log("Degen risk accepted")}
      />
    </div>
  );
}

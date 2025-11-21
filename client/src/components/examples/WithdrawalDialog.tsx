import { useState } from "react";
import { WithdrawalDialog } from "../WithdrawalDialog";
import { Button } from "@/components/ui/button";

export default function WithdrawalDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>
        Open Withdrawal Dialog
      </Button>

      <WithdrawalDialog
        open={open}
        onOpenChange={setOpen}
        depositedAmount={5000}
        currentValue={5420.50}
        donatedToDate={210.25}
        causeName="Mujeres2000"
        onConfirm={(amount) => console.log("Withdraw:", amount)}
      />
    </div>
  );
}

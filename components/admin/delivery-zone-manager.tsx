"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createDeliveryZone,
  deleteDeliveryZone,
  updateDeliveryZone,
} from "@/lib/actions/delivery-zone.actions";
import { formatCurreny, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DeliveryZoneRow = {
  id: string;
  name: string;
  cityKeywords: string[];
  deliveryFee: number;
  minEtaMinutes: number;
  maxEtaMinutes: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

type DeliveryZoneDraft = {
  name: string;
  cityKeywordsText: string;
  deliveryFee: string;
  minEtaMinutes: string;
  maxEtaMinutes: string;
  isActive: boolean;
};

const EMPTY_DRAFT: DeliveryZoneDraft = {
  name: "",
  cityKeywordsText: "",
  deliveryFee: "",
  minEtaMinutes: "",
  maxEtaMinutes: "",
  isActive: true,
};

const keywordsFromText = (value: string) =>
  value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

const toDraft = (zone: DeliveryZoneRow): DeliveryZoneDraft => ({
  name: zone.name,
  cityKeywordsText: zone.cityKeywords.join(", "),
  deliveryFee: String(zone.deliveryFee),
  minEtaMinutes: String(zone.minEtaMinutes),
  maxEtaMinutes: String(zone.maxEtaMinutes),
  isActive: zone.isActive,
});

const DeliveryZoneManager = ({
  initialZones,
  defaultDeliveryFee,
}: {
  initialZones: DeliveryZoneRow[];
  defaultDeliveryFee: number;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [createDraft, setCreateDraft] = useState<DeliveryZoneDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DeliveryZoneDraft>(EMPTY_DRAFT);

  const zones = useMemo(
    () =>
      [...initialZones].sort((a, b) => {
        if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
        return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
      }),
    [initialZones]
  );

  const onCreate = () => {
    startTransition(async () => {
      const res = await createDeliveryZone({
        name: createDraft.name,
        cityKeywords: keywordsFromText(createDraft.cityKeywordsText),
        deliveryFee: Number(createDraft.deliveryFee),
        minEtaMinutes: Number(createDraft.minEtaMinutes),
        maxEtaMinutes: Number(createDraft.maxEtaMinutes),
        isActive: createDraft.isActive,
      });

      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });

      if (res.success) {
        setCreateDraft(EMPTY_DRAFT);
        router.refresh();
      }
    });
  };

  const onStartEdit = (zone: DeliveryZoneRow) => {
    setEditingId(zone.id);
    setEditDraft(toDraft(zone));
  };

  const onSaveEdit = () => {
    if (!editingId) return;

    startTransition(async () => {
      const res = await updateDeliveryZone({
        id: editingId,
        name: editDraft.name,
        cityKeywords: keywordsFromText(editDraft.cityKeywordsText),
        deliveryFee: Number(editDraft.deliveryFee),
        minEtaMinutes: Number(editDraft.minEtaMinutes),
        maxEtaMinutes: Number(editDraft.maxEtaMinutes),
        isActive: editDraft.isActive,
      });

      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });

      if (res.success) {
        setEditingId(null);
        setEditDraft(EMPTY_DRAFT);
        router.refresh();
      }
    });
  };

  const onDelete = (zone: DeliveryZoneRow) => {
    const isConfirmed = window.confirm(
      `Delete "${zone.name}"? Orders will fallback to default pricing for those cities.`
    );
    if (!isConfirmed) return;

    startTransition(async () => {
      const res = await deleteDeliveryZone(zone.id);
      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });
      if (res.success) router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border p-4 md:p-6 space-y-4">
        <h2 className="text-xl font-semibold">Create Delivery Zone</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            value={createDraft.name}
            onChange={(e) =>
              setCreateDraft((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Zone name (e.g., Nearby Zone)"
            disabled={isPending}
          />
          <Input
            value={createDraft.deliveryFee}
            onChange={(e) =>
              setCreateDraft((prev) => ({ ...prev, deliveryFee: e.target.value }))
            }
            type="number"
            min={0}
            step="0.01"
            placeholder="Delivery fee (LKR)"
            disabled={isPending}
          />
          <Input
            value={createDraft.minEtaMinutes}
            onChange={(e) =>
              setCreateDraft((prev) => ({ ...prev, minEtaMinutes: e.target.value }))
            }
            type="number"
            min={1}
            placeholder="Min ETA (minutes)"
            disabled={isPending}
          />
          <Input
            value={createDraft.maxEtaMinutes}
            onChange={(e) =>
              setCreateDraft((prev) => ({ ...prev, maxEtaMinutes: e.target.value }))
            }
            type="number"
            min={1}
            placeholder="Max ETA (minutes)"
            disabled={isPending}
          />
        </div>
        <Input
          value={createDraft.cityKeywordsText}
          onChange={(e) =>
            setCreateDraft((prev) => ({ ...prev, cityKeywordsText: e.target.value }))
          }
          placeholder="City keywords separated by commas (e.g., ja-ela, kandana)"
          disabled={isPending}
        />
        <div className="flex items-center gap-2">
          <Checkbox
            checked={createDraft.isActive}
            onCheckedChange={(checked) =>
              setCreateDraft((prev) => ({ ...prev, isActive: checked === true }))
            }
            disabled={isPending}
          />
          <span className="text-sm">Active and available for checkout pricing</span>
        </div>
        <Button
          onClick={onCreate}
          disabled={
            isPending ||
            createDraft.name.trim().length < 2 ||
            keywordsFromText(createDraft.cityKeywordsText).length === 0
          }
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add Zone
        </Button>
      </div>

      <div className="rounded-xl border p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-2">Delivery Zone Rules</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          If no keyword matches a city, default delivery fee is{" "}
          {formatCurreny(defaultDeliveryFee)}.
        </p>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone</TableHead>
                <TableHead>Keywords</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[260px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((zone) => {
                const isEditing = editingId === zone.id;
                const draft = isEditing ? editDraft : toDraft(zone);
                return (
                  <TableRow key={zone.id}>
                    <TableCell className="min-w-[180px]">
                      {isEditing ? (
                        <Input
                          value={draft.name}
                          onChange={(e) =>
                            setEditDraft((prev) => ({ ...prev, name: e.target.value }))
                          }
                          disabled={isPending}
                        />
                      ) : (
                        zone.name
                      )}
                    </TableCell>
                    <TableCell className="min-w-[260px]">
                      {isEditing ? (
                        <Input
                          value={draft.cityKeywordsText}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              cityKeywordsText: e.target.value,
                            }))
                          }
                          disabled={isPending}
                        />
                      ) : (
                        zone.cityKeywords.join(", ")
                      )}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      {isEditing ? (
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={draft.deliveryFee}
                          onChange={(e) =>
                            setEditDraft((prev) => ({
                              ...prev,
                              deliveryFee: e.target.value,
                            }))
                          }
                          disabled={isPending}
                        />
                      ) : (
                        formatCurreny(zone.deliveryFee)
                      )}
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            value={draft.minEtaMinutes}
                            onChange={(e) =>
                              setEditDraft((prev) => ({
                                ...prev,
                                minEtaMinutes: e.target.value,
                              }))
                            }
                            disabled={isPending}
                          />
                          <span>-</span>
                          <Input
                            type="number"
                            min={1}
                            value={draft.maxEtaMinutes}
                            onChange={(e) =>
                              setEditDraft((prev) => ({
                                ...prev,
                                maxEtaMinutes: e.target.value,
                              }))
                            }
                            disabled={isPending}
                          />
                        </div>
                      ) : (
                        `${zone.minEtaMinutes}-${zone.maxEtaMinutes} mins`
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={draft.isActive}
                            onCheckedChange={(checked) =>
                              setEditDraft((prev) => ({
                                ...prev,
                                isActive: checked === true,
                              }))
                            }
                            disabled={isPending}
                          />
                          <span className="text-sm">Active</span>
                        </div>
                      ) : zone.isActive ? (
                        "Active"
                      ) : (
                        "Inactive"
                      )}
                    </TableCell>
                    <TableCell>{formatDateTime(zone.updatedAt).dateTime}</TableCell>
                    <TableCell className="space-x-2 whitespace-nowrap">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={onSaveEdit}
                            disabled={
                              isPending ||
                              draft.name.trim().length < 2 ||
                              keywordsFromText(draft.cityKeywordsText).length === 0
                            }
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingId(null)}
                            disabled={isPending}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onStartEdit(zone)}
                            disabled={isPending}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(zone)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryZoneManager;

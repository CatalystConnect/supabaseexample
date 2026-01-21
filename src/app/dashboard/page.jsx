"use client";

import { TableList } from "@/components/DataTable/Table";
import { Button } from "@/components/ui/button";
import { useCountryData, useDeleteCountryById } from "@/hooks/dataHook";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { countryColumn } from "./countryColumn";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddCountry from "@/components/Country/AddCountry";
import EditCountry from "@/components/Country/EditCountry";
import DeleteDialogBox from "@/components/Modal/Delete";
import { errorMessage, successMessage } from "@/components/ToasterMessage";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpenModal, setDeleteOpenModal] = useState(false);

  const { data: countries, isLoading } = useCountryData();
  const deleteCountryMutation = useDeleteCountryById();

  useEffect(() => {
    const loadUser = async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        router.replace("/");
        return;
      }

      setUser(data.user);
    };

    loadUser();
  }, [router]);

  const onDelete = async () => {
    try {
      if (!deleteId) return;

      await deleteCountryMutation.mutateAsync(deleteId);

      successMessage({ description: "Country deleted successfully" });
      setDeleteOpenModal(false);
      setDeleteId(null);
    } catch (err) {
      errorMessage({
        description: err?.message || "Something went wrong",
      });
    }
  };

  const logout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.replace("/");
  };

  const handleEditCountry = (row) => {
    setEditId(row?.id);
    setAddFormOpen(true);
  };

  const handleDeleteCountry = (row) => {
    setDeleteId(row?.id);
    setDeleteOpenModal(true);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="space-y-6">
          {/* Header Card */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-2xl">Dashboard</CardTitle>
                  <CardDescription className="mt-1">
                    Signed in as{" "}
                    <span className="font-medium text-foreground">
                      {user?.email || "—"}
                    </span>
                  </CardDescription>
                </div>

                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Countries Card */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-xl">Countries</CardTitle>
                  <CardDescription>
                    Manage all countries (add, edit, delete).
                  </CardDescription>
                </div>

                <Button
                  onClick={() => {
                    setEditId(null);
                    setAddFormOpen(true);
                  }}
                  className="cursor-pointer"
                >
                  Add Country
                </Button>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
              <TableList
                data={countries || []}
                columns={countryColumn(handleEditCountry, handleDeleteCountry)}
                loading={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Modal */}
        <Dialog
          open={addFormOpen}
          onOpenChange={(isOpen) => {
            setAddFormOpen(isOpen);
            if (!isOpen) setEditId(null);
          }}
          modal={false}
        >
          {addFormOpen && (
            <div className="fixed inset-0 bg-black/30 z-40 transition-opacity"></div>
          )}

          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            className="relative !max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 z-50 mx-auto my-auto dialog-test hide-scrollbar"
            style={{ position: "absolute" }}
          >
            {editId ? (
              <EditCountry
                editId={editId}
                setEditId={setEditId}
                setAddFormOpen={setAddFormOpen}
              />
            ) : (
              <AddCountry setAddFormOpen={setAddFormOpen} />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <DeleteDialogBox
          onDelete={onDelete}
          description="Are you sure you want to delete this country?"
          deleteOpenModal={deleteOpenModal}
          deleteHandleModalClose={() => setDeleteOpenModal(false)}
          deleteLoading={deleteCountryMutation.isPending}
        />
      </div>
    </div>
  );
}

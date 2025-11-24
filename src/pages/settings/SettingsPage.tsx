import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { UserPlus } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

import toast from "react-hot-toast";
// import Header from "../admin/components/Header";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    country: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      console.log("In handleSubmit");
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("country", form.country);

      console.log("Checking artist?")
      const isArtist = await axiosInstance.get("/users/checkArtist");
      console.log("isArtist:", isArtist);

      if (isArtist){
        return toast.success("Already an artist!");
      }

      await axiosInstance.post("/users/registerArtist", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Artist registered successfully");
    } catch (err: any) {
      toast.error("Failed to register artist: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex gap-2 items-center">
            <UserPlus size={18} />
            Register
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register Artist</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">

            <Input
              placeholder="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <Input
              placeholder="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
            />

          </div>

          <DialogFooter className="mt-4">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
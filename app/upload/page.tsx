import { Metadata } from "next";
import UploadClient from "./UploadClient";

export const metadata: Metadata = {
  title: "Fotos hochladen – Bauklar",
  robots: "noindex, follow",
};

export default function UploadPage() {
  return <UploadClient />;
}

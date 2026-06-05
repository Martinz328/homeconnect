"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import {
  Check,
  CheckCircle,
  ChevronLeft,
  Lock,
  Plus,
  UploadCloud,
  X,
} from "lucide-react";

import { submitListing } from "@/app/actions/listings";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AMENITIES,
  HOUSE_RULES,
  QUARTERS,
  ROOM_TYPES,
} from "@/lib/constants";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const WHATSAPP_PATTERN = /^6[0-9]{8}$/;
const MIN_PRICE = 5000;
const MAX_PRICE = 500000;

interface FormData {
  firstName: string;
  roomType: string;
  quarter: string;
  specifyLocation: string;
  capacity: string;
  price: string;
  amenities: string[];
  houseRules: string[];
  whatsapp: string;
  agreed: boolean;
}

type FieldErrors = Partial<
  Record<
    | "firstName"
    | "roomType"
    | "quarter"
    | "specifyLocation"
    | "capacity"
    | "price"
    | "whatsapp"
    | "photos"
    | "agreed",
    string
  >
>;

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}

function getExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName === "jpeg" || fromName === "jpg") return "jpg";
  if (fromName === "png") return "png";
  if (file.type === "image/png") return "png";
  return "jpg";
}

function capacityToSpaces(capacity: string): number {
  if (capacity === "3+") return 3;
  return Number.parseInt(capacity, 10);
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="flex items-center gap-0">
        {[1, 2, 3].map((s, index) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                "flex h-[10px] w-[10px] items-center justify-center rounded-full",
                s < step
                  ? "bg-primary"
                  : s === step
                    ? "bg-primary"
                    : "border border-border bg-white",
              )}
            >
              {s < step && (
                <Check className="h-[6px] w-[6px] text-white" strokeWidth={3} />
              )}
            </div>
            {index < 2 && <div className="h-px w-16 bg-border" />}
          </div>
        ))}
      </div>
      <span className="text-[13px] font-normal text-muted">Step {step} of 3</span>
    </div>
  );
}

function HostFormHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="flex items-center border-b border-border bg-white px-5 py-3">
      <button
        type="button"
        onClick={onBack}
        className="-ml-1 p-1"
        aria-label="Go back"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </button>
      <h1 className="flex-1 pr-6 text-center text-[18px] font-semibold text-foreground">
        List Your Room
      </h1>
    </header>
  );
}

function InputField({
  label,
  required,
  children,
  helper,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  helper?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[15px] font-medium text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {children}
      {helper && !error && (
        <span className="text-[13px] text-muted">{helper}</span>
      )}
      {error && <span className="text-[13px] text-[#C0392B]">{error}</span>}
    </div>
  );
}

function StyledInput({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-12 rounded-lg border border-border bg-white px-4 text-[15px] text-foreground transition-colors placeholder:text-muted focus:border-primary focus:bg-primary-tint focus:outline-none"
    />
  );
}

function StyledSelectTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<typeof SelectTrigger>) {
  return (
    <SelectTrigger
      {...props}
      className={cn(
        "h-12 w-full rounded-lg border border-border bg-white px-4 text-[15px] text-foreground focus:border-primary focus:bg-primary-tint focus:ring-0 data-[placeholder]:text-muted",
        className,
      )}
    >
      {children}
    </SelectTrigger>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex h-12 cursor-pointer items-center gap-3">
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
      />
      <span className="text-[15px] text-foreground">{label}</span>
    </label>
  );
}

export function HostListingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    roomType: "",
    quarter: "",
    specifyLocation: "",
    capacity: "",
    price: "",
    amenities: [],
    houseRules: [],
    whatsapp: "",
    agreed: false,
  });
  const [photosPaths, setPhotosPaths] = useState<string[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateFormData = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (fieldErrors[key as keyof FieldErrors]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key as keyof FieldErrors];
        return next;
      });
    }
  };

  const toggleArrayItem = (key: "amenities" | "houseRules", itemKey: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(itemKey)
        ? prev[key].filter((i) => i !== itemKey)
        : [...prev[key], itemKey],
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const slotsLeft = 5 - photosPaths.length;
    if (slotsLeft <= 0) return;

    setIsUploadingPhotos(true);
    setUploadError("");

    const supabase = createClient();
    const newPaths: string[] = [];
    const newPreviews: string[] = [];

    try {
      for (const file of Array.from(files).slice(0, slotsLeft)) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        });
        const ext = getExtension(compressed);
        const path = `listings/${Date.now()}-${randomSuffix()}.${ext}`;
        const { error } = await supabase.storage
          .from("listing-photos")
          .upload(path, compressed, { 
            upsert: false,
            contentType: compressed.type || "image/jpeg",  // added this line to fix the image upload error
           });

        if (error) {
          throw error;
        }

        newPaths.push(path);
        newPreviews.push(URL.createObjectURL(compressed));
      }

      setPhotosPaths((prev) => [...prev, ...newPaths].slice(0, 5));
      setPhotoPreviews((prev) => [...prev, ...newPreviews].slice(0, 5));
      if (fieldErrors.photos) {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next.photos;
          return next;
        });
      }
    } catch {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
      setUploadError("Failed to upload photo. Please try again.");
    } finally {
      setIsUploadingPhotos(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotosPaths((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required.";
    }
    if (!formData.roomType) {
      errors.roomType = "Room type is required.";
    }
    if (!formData.quarter) {
      errors.quarter = "Quarter is required.";
    }
    if (formData.quarter === "Other" && !formData.specifyLocation.trim()) {
      errors.specifyLocation = "Please specify your location.";
    }
    if (!formData.capacity) {
      errors.capacity = "Please select how many examiners you can host.";
    }

    const price = Number.parseInt(formData.price, 10);
    if (
      !formData.price.trim() ||
      !Number.isInteger(price) ||
      price < MIN_PRICE ||
      price > MAX_PRICE
    ) {
      errors.price = `Price must be between ${MIN_PRICE.toLocaleString()} and ${MAX_PRICE.toLocaleString()} FCFA.`;
    }

    if (!WHATSAPP_PATTERN.test(formData.whatsapp.trim())) {
      errors.whatsapp =
        "Enter a valid 9-digit Cameroon number (e.g. 677123456).";
    }

    if (photosPaths.length < 1) {
      errors.photos = "Upload at least one photo.";
    }

    if (!formData.agreed) {
      errors.agreed = "You must agree before submitting.";
    }

    return errors;
  };

  const handleSubmit = async () => {
    setSubmitError("");
    const errors = validateForm();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (
        errors.firstName ||
        errors.roomType ||
        errors.quarter ||
        errors.specifyLocation ||
        errors.capacity
      ) {
        setStep(1);
      } else if (errors.price) {
        setStep(2);
      }
      return;
    }

    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("host_name", formData.firstName.trim());
    payload.append("whatsapp", formData.whatsapp.trim());
    payload.append("room_type", formData.roomType);
    payload.append("quarter", formData.quarter);
    if (formData.quarter === "Other") {
      payload.append("quarter_other", formData.specifyLocation.trim());
    }
    payload.append("spaces", String(capacityToSpaces(formData.capacity)));
    payload.append("price_per_2weeks", formData.price.trim());
    formData.amenities.forEach((key) => payload.append("amenities", key));
    formData.houseRules.forEach((key) => payload.append("house_rules", key));
    photosPaths.forEach((path) => payload.append("photos", path));

    const result = await submitListing(payload);

    setIsSubmitting(false);

    if (result.success) {
      photoPreviews.forEach((url) => URL.revokeObjectURL(url));
      setSubmitted(true);
      return;
    }

    setSubmitError(result.error);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
        <CheckCircle className="mb-4 h-12 w-12 text-success" />
        <h2 className="mb-6 font-heading text-[24px] font-bold text-foreground">
          Listing Submitted!
        </h2>
        <p className="text-center text-[15px] leading-relaxed text-muted">
          {"We'll review your listing within 24 hours."}
          <br />
          {"If approved, we'll contact you on WhatsApp."}
        </p>
        <Link
          href="/"
          className="mt-8 flex h-[52px] w-full items-center justify-center rounded-[10px] border border-primary text-[16px] font-semibold text-primary"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HostFormHeader
        onBack={() => {
          if (step > 1) {
            setStep(step - 1);
          } else {
            router.back();
          }
        }}
      />
      <StepIndicator step={step} />

      <div className="flex-1 px-5 pb-8">
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 rounded-xl bg-white p-4">
              <InputField
                label="First Name"
                required
                error={fieldErrors.firstName}
              >
                <StyledInput
                  type="text"
                  placeholder="e.g. Amara"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                />
              </InputField>

              <InputField
                label="Room Type"
                required
                error={fieldErrors.roomType}
              >
                <Select
                  value={formData.roomType}
                  onValueChange={(v) => {
                    if (v) updateFormData("roomType", v);
                  }}
                >
                  <StyledSelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </StyledSelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </InputField>

              <InputField
                label="Quarter / Location"
                required
                error={fieldErrors.quarter}
              >
                <Select
                  value={formData.quarter}
                  onValueChange={(v) => {
                    if (v) updateFormData("quarter", v);
                  }}
                >
                  <StyledSelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </StyledSelectTrigger>
                  <SelectContent>
                    {QUARTERS.map((q) => (
                      <SelectItem key={q} value={q}>
                        {q}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </InputField>

              {formData.quarter === "Other" && (
                <InputField
                  label="Specify Location"
                  required
                  error={fieldErrors.specifyLocation}
                >
                  <StyledInput
                    type="text"
                    placeholder="Enter your area name"
                    value={formData.specifyLocation}
                    onChange={(e) =>
                      updateFormData("specifyLocation", e.target.value)
                    }
                  />
                </InputField>
              )}

              <InputField
                label="How many examiners can you host?"
                required
                error={fieldErrors.capacity}
              >
                <div className="flex gap-3">
                  {["1", "2", "3+"].map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => updateFormData("capacity", cap)}
                      className={cn(
                        "h-12 flex-1 rounded-lg border text-[15px] font-medium transition-colors",
                        formData.capacity === cap
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white text-foreground",
                      )}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </InputField>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="h-[52px] w-full rounded-[10px] bg-primary text-[16px] font-semibold text-white"
            >
              {"Next: Pricing & Amenities →"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 rounded-xl bg-white p-4">
              <InputField
                label="Your price for 2 weeks (FCFA)"
                required
                helper="Suggested range: 15 000 – 35 000 FCFA"
                error={fieldErrors.price}
              >
                <StyledInput
                  type="number"
                  placeholder="e.g. 25000"
                  value={formData.price}
                  onChange={(e) => updateFormData("price", e.target.value)}
                />
              </InputField>

              <div className="flex flex-col gap-3">
                <span className="text-[15px] font-medium text-foreground">
                  Amenities (select all that apply)
                </span>
                <div className="grid grid-cols-2 gap-x-4">
                  {AMENITIES.map((amenity) => (
                    <CheckboxRow
                      key={amenity.key}
                      label={amenity.label}
                      checked={formData.amenities.includes(amenity.key)}
                      onChange={() => toggleArrayItem("amenities", amenity.key)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[15px] font-medium text-foreground">
                  House Rules (select all that apply)
                </span>
                <div className="grid grid-cols-2 gap-x-4">
                  {HOUSE_RULES.map((rule) => (
                    <CheckboxRow
                      key={rule.key}
                      label={rule.label}
                      checked={formData.houseRules.includes(rule.key)}
                      onChange={() => toggleArrayItem("houseRules", rule.key)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="h-[52px] w-full rounded-[10px] bg-primary text-[16px] font-semibold text-white"
            >
              {"Next: Contact & Photos →"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 rounded-xl bg-white p-4">
              <InputField
                label="Your WhatsApp Number"
                required
                helper="Cameroon number, digits only (e.g. 677123456)"
                error={fieldErrors.whatsapp}
              >
                <StyledInput
                  type="tel"
                  placeholder="6XXXXXXXX"
                  value={formData.whatsapp}
                  onChange={(e) => updateFormData("whatsapp", e.target.value)}
                />
              </InputField>

              <div className="flex gap-2 rounded-lg border-l-[3px] border-primary bg-primary-tint p-3">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-[13px] leading-relaxed text-trust-text">
                  Your name and WhatsApp number are private. Only HomeConnect
                  admin can see them. They are only shared with an examiner who
                  has paid the service fee and confirmed genuine interest in
                  your room.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[15px] font-medium text-foreground">
                  Room Photos <span className="text-primary">*</span>
                </span>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  disabled={isUploadingPhotos}
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {photoPreviews.length === 0 ? (
                  <button
                    type="button"
                    disabled={isUploadingPhotos}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-[100px] flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border"
                  >
                    <UploadCloud className="h-6 w-6 text-muted" />
                    <span className="text-[14px] text-muted">
                      {isUploadingPhotos ? "Uploading…" : "Tap to add photos"}
                    </span>
                    <span className="text-[12px] text-muted">
                      JPG or PNG · Min 1 · Max 5 · 5MB each
                    </span>
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {photoPreviews.map((preview, index) => (
                      <div key={photosPaths[index] ?? index} className="relative">
                        <img
                          src={preview}
                          alt={`Room photo ${index + 1}`}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm"
                        >
                          <X className="h-3 w-3 text-foreground" />
                        </button>
                      </div>
                    ))}
                    {photoPreviews.length < 5 && (
                      <button
                        type="button"
                        disabled={isUploadingPhotos}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-border"
                      >
                        <Plus className="h-6 w-6 text-muted" />
                      </button>
                    )}
                  </div>
                )}

                {fieldErrors.photos && (
                  <span className="text-[13px] text-[#C0392B]">
                    {fieldErrors.photos}
                  </span>
                )}
                {uploadError && (
                  <span className="text-[13px] text-[#C0392B]">{uploadError}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={formData.agreed}
                    onCheckedChange={(checked) =>
                      updateFormData("agreed", checked === true)
                    }
                    className="mt-0.5 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                  />
                  <span className="text-[14px] leading-relaxed text-foreground">
                    I understand HomeConnect charges the examiner a 15% service
                    fee before sharing my contact. I will receive my full quoted
                    price directly from the examiner.
                  </span>
                </label>
                {fieldErrors.agreed && (
                  <span className="text-[13px] text-[#C0392B]">
                    {fieldErrors.agreed}
                  </span>
                )}
              </div>
            </div>

            {submitError && (
              <p className="text-center text-[14px] text-[#C0392B]">{submitError}</p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isUploadingPhotos}
              className={cn(
                "h-[52px] w-full rounded-[10px] text-[16px] font-semibold transition-colors",
                isSubmitting || isUploadingPhotos
                  ? "cursor-not-allowed bg-border text-muted"
                  : "bg-primary text-white",
              )}
            >
              {isSubmitting ? "Submitting…" : "Submit Listing"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

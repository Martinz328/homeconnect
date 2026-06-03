'use client'

import { useState, useRef } from 'react'
import { ChevronLeft, Check, Lock, UploadCloud, X, Plus, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

const ROOM_TYPES = [
  'Single Room',
  'Room-Kitchen-Toilet',
  'Studio',
  'Apartment',
  'Shared Room',
]

const QUARTERS = [
  'Molyko',
  'Bonduma',
  'Sandpit',
  'Mile 17',
  'Clerks Quarter',
  'Santa Barbara',
  'Buea Town',
  'Bokwango',
  'Other',
]

const AMENITIES = [
  'Running water',
  'Stable electricity',
  'Generator backup',
  'WiFi',
  'Kitchen access',
  'Private bathroom',
  'Shared bathroom',
  'Furnished',
  'Fan',
  'A/C',
]

const HOUSE_RULES = [
  'No cooking',
  'No loud noise',
  'Male only',
  'Female only',
  'Any gender',
  'Couples allowed',
  'No visitors',
]

interface FormData {
  firstName: string
  roomType: string
  quarter: string
  specifyLocation: string
  capacity: string
  price: string
  amenities: string[]
  houseRules: string[]
  whatsapp: string
  photos: File[]
  agreed: boolean
}

export function HostListingForm() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    roomType: '',
    quarter: '',
    specifyLocation: '',
    capacity: '',
    price: '',
    amenities: [],
    houseRules: [],
    whatsapp: '',
    photos: [],
    agreed: false,
  })
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayItem = (key: 'amenities' | 'houseRules', item: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter((i) => i !== item)
        : [...prev[key], item],
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPhotos = Array.from(files).slice(0, 5 - formData.photos.length)
    const newPreviews = newPhotos.map((file) => URL.createObjectURL(file))

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos].slice(0, 5),
    }))
    setPhotoPreviews((prev) => [...prev, ...newPreviews].slice(0, 5))
  }

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviews[index])
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    // Placeholder submit logic
    console.log('Form submitted:', formData)
    setSubmitted(true)
  }

  const canSubmit = formData.agreed && formData.photos.length >= 1

  // Step Progress Indicator
  const StepIndicator = () => (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="flex items-center gap-0">
        {[1, 2, 3].map((s, index) => (
          <div key={s} className="flex items-center">
            {/* Step Circle */}
            <div
              className={cn(
                'w-[10px] h-[10px] rounded-full flex items-center justify-center',
                s < step
                  ? 'bg-primary'
                  : s === step
                    ? 'bg-primary'
                    : 'bg-white border border-border'
              )}
            >
              {s < step && <Check className="w-[6px] h-[6px] text-white" strokeWidth={3} />}
            </div>
            {/* Line between dots */}
            {index < 2 && (
              <div className="w-16 h-px bg-border" />
            )}
          </div>
        ))}
      </div>
      <span className="text-[13px] text-muted font-normal">Step {step} of 3</span>
    </div>
  )

  // Header
  const Header = () => (
    <header className="bg-white border-b border-border px-5 py-3 flex items-center">
      <button
        onClick={() => (step > 1 ? setStep(step - 1) : null)}
        className="p-1 -ml-1"
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <h1 className="flex-1 text-center font-semibold text-[18px] text-foreground pr-6">
        List Your Room
      </h1>
    </header>
  )

  // Input Field Component
  const InputField = ({
    label,
    required,
    children,
    helper,
  }: {
    label: string
    required?: boolean
    children: React.ReactNode
    helper?: string
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[15px] font-medium text-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {children}
      {helper && <span className="text-[13px] text-muted">{helper}</span>}
    </div>
  )

  // Custom styled input
  const StyledInput = ({
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      className="h-12 rounded-lg border border-border bg-white px-4 text-[15px] text-foreground placeholder:text-muted focus:outline-none focus:border-primary focus:bg-primary-tint transition-colors"
    />
  )

  // Custom styled select trigger
  const StyledSelectTrigger = ({
    children,
    className,
    ...props
  }: React.ComponentProps<typeof SelectTrigger>) => (
    <SelectTrigger
      {...props}
      className={cn(
        'h-12 w-full rounded-lg border border-border bg-white px-4 text-[15px] text-foreground focus:border-primary focus:bg-primary-tint focus:ring-0 data-[placeholder]:text-muted',
        className
      )}
    >
      {children}
    </SelectTrigger>
  )

  // Checkbox Row Component
  const CheckboxRow = ({
    label,
    checked,
    onChange,
  }: {
    label: string
    checked: boolean
    onChange: () => void
  }) => (
    <label className="flex items-center gap-3 h-12 cursor-pointer">
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      <span className="text-[15px] text-foreground">{label}</span>
    </label>
  )

  // Confirmation Screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
        <CheckCircle className="w-12 h-12 text-success mb-4" />
        <h2 className="font-heading font-bold text-[24px] text-foreground mb-6">
          Listing Submitted!
        </h2>
        <p className="text-[15px] text-muted text-center leading-relaxed">
          {"We'll review your listing within 24 hours."}
          <br />
          {"If approved, we'll contact you on WhatsApp."}
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setStep(1)
            setFormData({
              firstName: '',
              roomType: '',
              quarter: '',
              specifyLocation: '',
              capacity: '',
              price: '',
              amenities: [],
              houseRules: [],
              whatsapp: '',
              photos: [],
              agreed: false,
            })
            setPhotoPreviews([])
          }}
          className="mt-8 h-[52px] w-full rounded-[10px] border border-primary text-primary font-semibold text-[16px]"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <StepIndicator />

      <div className="flex-1 px-5 pb-8">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl p-4 flex flex-col gap-5">
              <InputField label="First Name" required>
                <StyledInput
                  type="text"
                  placeholder="e.g. Amara"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                />
              </InputField>

              <InputField label="Room Type" required>
                <Select
                  value={formData.roomType}
                  onValueChange={(v) => updateFormData('roomType', v)}
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

              <InputField label="Quarter / Location" required>
                <Select
                  value={formData.quarter}
                  onValueChange={(v) => updateFormData('quarter', v)}
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

              {formData.quarter === 'Other' && (
                <InputField label="Specify Location" required>
                  <StyledInput
                    type="text"
                    placeholder="Enter your area name"
                    value={formData.specifyLocation}
                    onChange={(e) => updateFormData('specifyLocation', e.target.value)}
                  />
                </InputField>
              )}

              <InputField label="How many examiners can you host?" required>
                <div className="flex gap-3">
                  {['1', '2', '3+'].map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => updateFormData('capacity', cap)}
                      className={cn(
                        'flex-1 h-12 rounded-lg border text-[15px] font-medium transition-colors',
                        formData.capacity === cap
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-foreground border-border'
                      )}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </InputField>
            </div>

            <button
              onClick={() => setStep(2)}
              className="h-[52px] w-full rounded-[10px] bg-primary text-white font-semibold text-[16px]"
            >
              {'Next: Pricing & Amenities →'}
            </button>
          </div>
        )}

        {/* Step 2: Pricing & Amenities */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl p-4 flex flex-col gap-5">
              <InputField
                label="Your price for 2 weeks (FCFA)"
                required
                helper="Suggested range: 15 000 – 35 000 FCFA"
              >
                <StyledInput
                  type="number"
                  placeholder="e.g. 25000"
                  value={formData.price}
                  onChange={(e) => updateFormData('price', e.target.value)}
                />
              </InputField>

              <div className="flex flex-col gap-3">
                <span className="text-[15px] font-medium text-foreground">
                  Amenities (select all that apply)
                </span>
                <div className="grid grid-cols-2 gap-x-4">
                  {AMENITIES.map((amenity) => (
                    <CheckboxRow
                      key={amenity}
                      label={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => toggleArrayItem('amenities', amenity)}
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
                      key={rule}
                      label={rule}
                      checked={formData.houseRules.includes(rule)}
                      onChange={() => toggleArrayItem('houseRules', rule)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="h-[52px] w-full rounded-[10px] bg-primary text-white font-semibold text-[16px]"
            >
              {'Next: Contact & Photos →'}
            </button>
          </div>
        )}

        {/* Step 3: Contact & Agreement */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl p-4 flex flex-col gap-5">
              <InputField
                label="Your WhatsApp Number"
                required
                helper="Cameroon number, digits only (e.g. 677123456)"
              >
                <StyledInput
                  type="tel"
                  placeholder="6XXXXXXXX"
                  value={formData.whatsapp}
                  onChange={(e) => updateFormData('whatsapp', e.target.value)}
                />
              </InputField>

              {/* Privacy Notice */}
              <div className="bg-primary-tint border-l-[3px] border-primary rounded-lg p-3 flex gap-2">
                <Lock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-[13px] text-trust-text leading-relaxed">
                  Your name and WhatsApp number are private. Only HomeConnect admin can see them. They are only shared with an examiner who has paid the service fee and confirmed genuine interest in your room.
                </p>
              </div>

              {/* Photo Upload */}
              <div className="flex flex-col gap-3">
                <span className="text-[15px] font-medium text-foreground">
                  Room Photos <span className="text-primary">*</span>
                </span>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {photoPreviews.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-[100px] rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1"
                  >
                    <UploadCloud className="w-6 h-6 text-muted" />
                    <span className="text-[14px] text-muted">Tap to add photos</span>
                    <span className="text-[12px] text-muted">
                      JPG or PNG · Min 1 · Max 5 · 5MB each
                    </span>
                  </button>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {photoPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Room photo ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm"
                        >
                          <X className="w-3 h-3 text-foreground" />
                        </button>
                      </div>
                    ))}
                    {photoPreviews.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center"
                      >
                        <Plus className="w-6 h-6 text-muted" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={formData.agreed}
                  onCheckedChange={(checked) =>
                    updateFormData('agreed', checked === true)
                  }
                  className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-[14px] text-foreground leading-relaxed">
                  I understand HomeConnect charges the examiner a 15% service fee before sharing my contact. I will receive my full quoted price directly from the examiner.
                </span>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={cn(
                'h-[52px] w-full rounded-[10px] font-semibold text-[16px] transition-colors',
                canSubmit
                  ? 'bg-primary text-white'
                  : 'bg-border text-muted cursor-not-allowed'
              )}
            >
              Submit Listing
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

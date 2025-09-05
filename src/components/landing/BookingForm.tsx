"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { BookingDataType } from "@/lib/types";
import { DEFAULT_FORM_DATA, PLANS } from "@/lib/consts";

interface BookingFormProps {
  onSubmit?: (data: BookingDataType) => void;
  isLoading?: boolean;
  error: string | null;
  onClearError: () => void;
}

export default function BookingForm({ onSubmit, isLoading }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingDataType>(DEFAULT_FORM_DATA);

  // Centralized change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else if (name.startsWith('timeFrom.') || name.startsWith('timeTo.')) {
      const [timeType, timeField] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [timeType]: {
          ...prev[timeType as 'timeFrom' | 'timeTo'],
          [timeField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) || 0 : value
      }));
    }
  };

  // Handle radio button changes
  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle checkbox arrays (halls and services)
  const handleCheckboxToggle = (arrayName: 'hallSelection' | 'services', item: string) => {
    setFormData(prev => {
      const currentArray = prev[arrayName];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      return { ...prev, [arrayName]: newArray };
    });
  };

  // Handle time meridian changes
  const handleTimeChange = (timeType: 'timeFrom' | 'timeTo', field: 'hour' | 'minute' | 'meridian', value: string) => {
    setFormData(prev => ({
      ...prev,
      [timeType]: {
        ...prev[timeType],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const hallOptions = [
    "Palmyra Hall",
    "Private Hall",
    "Conference / Meeting Room"
  ];

  const serviceOptions = [
    "Table & Chair Decoration",
    "Hall & Stage Decoration",
    "Catering",
    "Bathtime",
    "Cleaning, crockery and glassware",
    "Theatre",
    "Event Hire featured",
    "DJ System",
    "Videography",
    "Photography",
    "Sound System Management",
    "Setup"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Booking Form
          </h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Reserve your perfect venue today
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-lg p-8 border">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Booking Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground border-b pb-2">
                <Calendar className="w-5 h-5" />
                Booking Details
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Booking Type *</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="private"
                        name="bookingType"
                        checked={formData.bookingType === "private"}
                        onChange={() => handleRadioChange("bookingType", "private")}
                        className="text-primary"
                      />
                      <Label htmlFor="private" className="text-sm">Private</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="organization"
                        name="bookingType"
                        checked={formData.bookingType === "organization"}
                        onChange={() => handleRadioChange("bookingType", "organization")}
                        className="text-primary"
                      />
                      <Label htmlFor="organization" className="text-sm">Organization / Public</Label>
                    </div>
                  </div>
                </div>

                {/* Event Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Event Type *</Label>
                  <Select value={formData.eventType} onValueChange={(value) => handleSelectChange("eventType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(PLANS).map((key) => {
                        const plan = PLANS[key as keyof typeof PLANS];
                        return (
                          <SelectItem key={key} value={key}>
                            {plan.name}
                          </SelectItem>
                        );
                      })}

                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hall Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Hall Selection *</Label>
                  <div className="space-y-2">
                    {hallOptions.map((hall) => (
                      <div key={hall} className="flex items-center space-x-2">
                        <Checkbox
                          id={hall.toLowerCase().replace(/\s+/g, '-')}
                          checked={formData.hallSelection.includes(hall)}
                          onCheckedChange={() => handleCheckboxToggle('hallSelection', hall)}
                        />
                        <Label htmlFor={hall.toLowerCase().replace(/\s+/g, '-')} className="text-sm">
                          {hall}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Number of Guests */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Number of Guests *</Label>
                  <Input
                    name="guests"
                    type="number"
                    placeholder="eg: 350"
                    value={formData.guests || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Booking Date */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Booking Date *</Label>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>

                {/* Time From */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Time From *</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="HH"
                      className="w-16"
                      maxLength={2}
                      value={formData.timeFrom.hour}
                      onChange={(e) => handleTimeChange('timeFrom', 'hour', e.target.value)}
                    />
                    <Input
                      placeholder="MM"
                      className="w-16"
                      maxLength={2}
                      value={formData.timeFrom.minute}
                      onChange={(e) => handleTimeChange('timeFrom', 'minute', e.target.value)}
                    />
                    <Select
                      value={formData.timeFrom.meridian}
                      onValueChange={(value) => handleTimeChange('timeFrom', 'meridian', value as 'AM' | 'PM')}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="AM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Time To */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Time To *</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="HH"
                      className="w-16"
                      maxLength={2}
                      value={formData.timeTo.hour}
                      onChange={(e) => handleTimeChange('timeTo', 'hour', e.target.value)}
                    />
                    <Input
                      placeholder="MM"
                      className="w-16"
                      maxLength={2}
                      value={formData.timeTo.minute}
                      onChange={(e) => handleTimeChange('timeTo', 'minute', e.target.value)}
                    />
                    <Select
                      value={formData.timeTo.meridian}
                      onValueChange={(value) => handleTimeChange('timeTo', 'meridian', value as 'AM' | 'PM')}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="PM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Services */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground border-b pb-2">
                <MapPin className="w-5 h-5" />
                Additional Services that you are interested
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceOptions.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service.toLowerCase().replace(/\s+/g, '-')}
                      checked={formData.services.includes(service)}
                      onCheckedChange={() => handleCheckboxToggle('services', service)}
                    />
                    <Label htmlFor={service.toLowerCase().replace(/\s+/g, '-')} className="text-sm">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Additional Information */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Any other Information</Label>
                <Textarea
                  name="info"
                  placeholder="Type here..."
                  className="min-h-[100px]"
                  value={formData.info || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contact Details */}
            {/* <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground border-b pb-2">
                <Clock className="w-5 h-5" />
                Contact Details
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Name *</Label>
                  <div className="grid grid-cols-2 gap-3 */}

            {/* Contact */}
            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground border-b pb-2">
                <User className="w-5 h-5" />
                Contact Details
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Name *</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      name="contact.firstName"
                      placeholder="First Name"
                      value={formData.contact.firstName}
                      onChange={handleChange}
                    />
                    <Input
                      name="contact.lastName"
                      placeholder="Last Name"
                      value={formData.contact.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Email *</Label>
                  <Input
                    name="contact.email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.contact.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Mobile *</Label>
                  <Input
                    name="contact.mobile"
                    type="tel"
                    placeholder="+61 4XX XXX XXX"
                    value={formData.contact.mobile}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Address</Label>
                  <Input
                    name="contact.address"
                    placeholder="Street Address"
                    value={formData.contact.address || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">City</Label>
                  <Input
                    name="contact.city"
                    placeholder="City"
                    value={formData.contact.city || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">State</Label>
                  <Input
                    name="contact.state"
                    placeholder="State"
                    value={formData.contact.state || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Postcode</Label>
                  <Input
                    name="contact.postcode"
                    placeholder="Postcode"
                    value={formData.contact.postcode || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="text-center pt-6">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

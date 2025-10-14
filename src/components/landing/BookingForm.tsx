"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, MapPin, User, AlertCircle, CheckCircle } from "lucide-react";
import { BookingDataType } from "@/lib/types";
import { DEFAULT_FORM_DATA, PLANS } from "@/lib/consts";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookingFormProps {
  onSubmit?: (data: BookingDataType) => void;
  isLoading?: boolean;
  error: string | null;
  onClearError: () => void;
}

interface TimeSlot {
  hour: string;
  minute: string;
  meridian: "AM" | "PM";
}

export default function BookingForm({ onSubmit, isLoading }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingDataType>(DEFAULT_FORM_DATA);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'unavailable' | null>(null);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Validate date is not in the past
  const isValidDate = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const selectedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  // Convert time to minutes for comparison
  const timeToMinutes = (time: TimeSlot): number => {
    let hours = parseInt(time.hour) || 0;
    const minutes = parseInt(time.minute) || 0;
    
    if (time.meridian === "PM" && hours !== 12) {
      hours += 12;
    } else if (time.meridian === "AM" && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };

  // Fetch available slots when date or hall changes
  useEffect(() => {
    if (!isValidDate(formData.date)) {
      setAvailableSlots([]);
      setAvailabilityStatus(null);
      setApiError(null);
      setFormData(prev => ({
        ...prev,
        timeFrom: { hour: "", minute: "", meridian: "AM" },
        timeTo: { hour: "", minute: "", meridian: "AM" }
      }));
      return;
    }

    if (formData.date && formData.hallSelection.length > 0) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
      setAvailabilityStatus(null);
      setApiError(null);
    }
  }, [formData.date, JSON.stringify(formData.hallSelection)]);

  // Check specific time slot availability
  useEffect(() => {
    if (
      isValidDate(formData.date) &&
      formData.hallSelection.length > 0 &&
      formData.timeFrom.hour && 
      formData.timeFrom.minute &&
      formData.timeTo.hour && 
      formData.timeTo.minute
    ) {
      checkTimeSlotAvailability();
    } else {
      setAvailabilityStatus(null);
    }
  }, [
    formData.date, 
    JSON.stringify(formData.hallSelection), 
    JSON.stringify(formData.timeFrom), 
    JSON.stringify(formData.timeTo)
  ]);

  const fetchAvailableSlots = async () => {
    setIsFetchingSlots(true);
    setApiError(null);

    try {
      const response = await fetch("/api/booking/available-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formData.date,
          hallSelection: formData.hallSelection
        })
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const slots = data.slots || [];
        setAvailableSlots(slots);
        
        if (slots.length === 0) {
          setApiError("No time slots available for the selected date and halls.");
        }
      } else {
        setApiError(data.message || "Failed to fetch slots");
        setAvailableSlots([]);
      }
    } catch (error: any) {
      setApiError(error.message || "Network error");
      setAvailableSlots([]);
    } finally {
      setIsFetchingSlots(false);
    }
  };

  const checkTimeSlotAvailability = async () => {
    setIsCheckingAvailability(true);

    try {
      const response = await fetch("/api/booking/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formData.date,
          hallSelection: formData.hallSelection,
          timeFrom: formData.timeFrom,
          timeTo: formData.timeTo
        })
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      setAvailabilityStatus(data.available ? "available" : "unavailable");
    } catch (error: any) {
      setAvailabilityStatus("unavailable");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const getTimeFromOptions = (): TimeSlot[] => {
    if (!isValidDate(formData.date)) {
      return [];
    }

    if (formData.hallSelection.length === 0) {
      return [];
    }
    
    if (isFetchingSlots) {
      return [];
    }
    
    if (apiError) {
      return [];
    }
    
    return availableSlots;
  };

  const getTimeToOptions = (): TimeSlot[] => {
    if (!isValidDate(formData.date)) {
      return [];
    }

    if (formData.hallSelection.length === 0) {
      return [];
    }
    
    if (isFetchingSlots) {
      return [];
    }
    
    if (apiError) {
      return [];
    }

    // If no "Time From" selected, return empty
    if (!formData.timeFrom.hour) {
      return [];
    }

    const fromMinutes = timeToMinutes(formData.timeFrom);
    
    // Filter slots that are AFTER "Time From"
    return availableSlots.filter(slot => {
      const slotMinutes = timeToMinutes(slot);
      return slotMinutes > fromMinutes;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name === 'date') {
      if (!isValidDate(value)) {
        setDateError("Please select a current or future date");
      } else {
        setDateError(null);
      }
    }

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

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxToggle = (arrayName: 'hallSelection' | 'services', item: string) => {
    setFormData(prev => {
      const currentArray = prev[arrayName];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      return { ...prev, [arrayName]: newArray };
    });
  };

  const handleTimeDropdownChange = (timeType: 'timeFrom' | 'timeTo', value: string) => {
    const [time, meridian] = value.split(' ');
    const [hour, minute] = time.split(':');
    
    const newTime = {
      hour,
      minute,
      meridian: meridian as 'AM' | 'PM'
    };

    setFormData(prev => {
      // If changing "Time From" and it's now after "Time To", reset "Time To"
      if (timeType === 'timeFrom' && prev.timeTo.hour) {
        const newFromMinutes = timeToMinutes(newTime);
        const currentToMinutes = timeToMinutes(prev.timeTo);
        
        if (newFromMinutes >= currentToMinutes) {
          return {
            ...prev,
            timeFrom: newTime,
            timeTo: { hour: "", minute: "", meridian: "AM" }
          };
        }
      }

      return {
        ...prev,
        [timeType]: newTime
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidDate(formData.date)) {
      alert("Please select a valid date (current or future date only)");
      return;
    }

    if (formData.hallSelection.length === 0) {
      alert("Please select at least one hall");
      return;
    }

    if (!formData.timeFrom.hour || !formData.timeTo.hour) {
      alert("Please select both start and end times");
      return;
    }

    if (availabilityStatus === 'unavailable') {
      alert("Selected time slot is not available. Please choose another time.");
      return;
    }

    if (availabilityStatus !== 'available') {
      alert("Please wait while we verify availability");
      return;
    }
    
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

  const formatTimeSlot = (slot: TimeSlot): string => {
    return `${slot.hour}:${slot.minute} ${slot.meridian}`;
  };

  const getCurrentTimeValue = (timeType: 'timeFrom' | 'timeTo'): string => {
    const time = formData[timeType];
    if (!time.hour || !time.minute) return "";
    return formatTimeSlot(time);
  };

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
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground border-b pb-2">
                <Calendar className="w-5 h-5" />
                Booking Details
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="space-y-3">
                <Label className="text-sm font-medium">Booking Date *</Label>
                <Input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={getTodayDate()}
                  className="max-w-xs"
                />
                {dateError && (
                  <p className="text-sm text-destructive">{dateError}</p>
                )}
                {!formData.date && (
                  <p className="text-sm text-muted-foreground">
                    Please select a date to view available time slots
                  </p>
                )}
              </div>

              {formData.date && isValidDate(formData.date) && formData.hallSelection.length === 0 && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Please select at least one hall to view available time slots
                  </AlertDescription>
                </Alert>
              )}

              {apiError && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700">
                    {apiError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Time From * 
                    {isFetchingSlots && <span className="text-xs text-muted-foreground ml-2">(Loading...)</span>}
                  </Label>
                  <Select
                    value={getCurrentTimeValue('timeFrom')}
                    onValueChange={(value) => handleTimeDropdownChange('timeFrom', value)}
                    disabled={!isValidDate(formData.date) || formData.hallSelection.length === 0 || isFetchingSlots}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !formData.date ? "Select date first" :
                        formData.hallSelection.length === 0 ? "Select hall first" :
                        isFetchingSlots ? "Loading..." :
                        getTimeFromOptions().length === 0 ? "No slots available" :
                        "Select start time"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {getTimeFromOptions().length === 0 ? (
                        <SelectItem value="no-slots" disabled>No available slots</SelectItem>
                      ) : (
                        getTimeFromOptions().map((slot, idx) => (
                          <SelectItem key={idx} value={formatTimeSlot(slot)}>
                            {formatTimeSlot(slot)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Time To *</Label>
                  <Select
                    value={getCurrentTimeValue('timeTo')}
                    onValueChange={(value) => handleTimeDropdownChange('timeTo', value)}
                    disabled={!formData.timeFrom.hour || isFetchingSlots}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !formData.timeFrom.hour ? "Select start time first" :
                        isFetchingSlots ? "Loading..." :
                        getTimeToOptions().length === 0 ? "No slots available" :
                        "Select end time"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {getTimeToOptions().length === 0 ? (
                        <SelectItem value="no-slots" disabled>No available slots</SelectItem>
                      ) : (
                        getTimeToOptions().map((slot, idx) => (
                          <SelectItem key={idx} value={formatTimeSlot(slot)}>
                            {formatTimeSlot(slot)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isCheckingAvailability && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Checking availability...
                  </AlertDescription>
                </Alert>
              )}

              {!isCheckingAvailability && availabilityStatus === 'available' && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    ✓ Time slot is available! You can proceed with booking.
                  </AlertDescription>
                </Alert>
              )}

              {!isCheckingAvailability && availabilityStatus === 'unavailable' && (
                <Alert className="bg-destructive/10 border-destructive/20">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    ✗ Time slot is not available. Please choose another time.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground border-b pb-2">
                <MapPin className="w-5 h-5" />
                Additional Services
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

            <div className="text-center pt-6">
              <Button 
                type="submit" 
                size="lg" 
                disabled={
                  isLoading || 
                  !isValidDate(formData.date) ||
                  formData.hallSelection.length === 0 ||
                  !formData.timeFrom.hour ||
                  !formData.timeTo.hour ||
                  availabilityStatus !== 'available' || 
                  isCheckingAvailability ||
                  isFetchingSlots
                }
              >
                {isLoading ? "Submitting..." : "Submit Booking"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
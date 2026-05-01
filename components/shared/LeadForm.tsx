"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  student_name: z.string().min(2, "Please enter the student's name"),
  parent_name: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  grade: z.string().min(1, "Please select a grade"),
  service: z.string().min(1, "Please select a service"),
  ap_subject: z.string().optional(),
  current_score: z.string().optional(),
  target_score: z.string().optional(),
  test_date: z.string().optional(),
  tutoring_format: z.string().min(1, "Please select a format"),
  availability_notes: z.string().optional(),
  help_needed: z.string().optional(),
  consent: z.boolean().refine((v) => v === true, {
    message: "Please confirm your consent to continue",
  }),
});

type FormData = z.infer<typeof schema>;

const AP_SUBJECTS = [
  "AP Calculus AB", "AP Calculus BC", "AP Statistics",
  "AP Physics 1", "AP Physics 2", "AP Physics C",
  "AP Chemistry", "AP Biology",
  "AP English Language", "AP English Literature",
  "AP US History", "AP World History", "AP European History",
  "AP Psychology", "AP Computer Science A",
  "Other AP Subject",
];

const GRADES = ["8th", "9th", "10th", "11th", "12th", "College", "Other"];

export default function LeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { consent: false },
  });

  const selectedService = watch("service");
  const showApSubject = selectedService === "AP Tutoring";

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed");
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-6"
      >
        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} className="text-amber-400" />
        </div>
        <h3 className="text-2xl font-bold text-[#f0ede6] mb-3">Inquiry Received</h3>
        <p className="text-[#8896a7] leading-relaxed max-w-md mx-auto">
          Thanks — your inquiry was received. Nyx Scholars will reach out soon to help match you with the right tutor.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Student & Parent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="student_name">Student Name *</Label>
          <Input id="student_name" placeholder="First Last" {...register("student_name")} />
          {errors.student_name && (
            <p className="text-red-400 text-xs">{errors.student_name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="parent_name">Parent / Guardian Name</Label>
          <Input id="parent_name" placeholder="Optional" {...register("parent_name")} />
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address *</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && (
            <p className="text-red-400 text-xs">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" {...register("phone")} />
        </div>
      </div>

      {/* Grade & Service */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Student Grade *</Label>
          <Select onValueChange={(v) => setValue("grade", v, { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {GRADES.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.grade && (
            <p className="text-red-400 text-xs">{errors.grade.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Service Interested In *</Label>
          <Select onValueChange={(v) => setValue("service", v, { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SAT">SAT Tutoring</SelectItem>
              <SelectItem value="ACT">ACT Tutoring</SelectItem>
              <SelectItem value="AP Tutoring">AP Tutoring</SelectItem>
              <SelectItem value="College Admissions Consulting">College Admissions Consulting</SelectItem>
              <SelectItem value="Not sure yet">Not sure yet</SelectItem>
            </SelectContent>
          </Select>
          {errors.service && (
            <p className="text-red-400 text-xs">{errors.service.message}</p>
          )}
        </div>
      </div>

      {/* AP subject (conditional) */}
      <AnimatePresence>
        {showApSubject && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5 overflow-hidden"
          >
            <Label>AP Subject</Label>
            <Select onValueChange={(v) => setValue("ap_subject", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select AP subject" />
              </SelectTrigger>
              <SelectContent>
                {AP_SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scores & date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="current_score">Current Score</Label>
          <Input id="current_score" placeholder="e.g. 1200" {...register("current_score")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="target_score">Target Score</Label>
          <Input id="target_score" placeholder="e.g. 1500" {...register("target_score")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="test_date">Test Date</Label>
          <Input id="test_date" type="date" {...register("test_date")} className="text-[#f0ede6]" />
        </div>
      </div>

      {/* Format */}
      <div className="space-y-1.5">
        <Label>Preferred Tutoring Format *</Label>
        <Select onValueChange={(v) => setValue("tutoring_format", v, { shouldValidate: true })}>
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Online">Online</SelectItem>
            <SelectItem value="In-person (if available)">In-person (if available)</SelectItem>
            <SelectItem value="Either">Either works</SelectItem>
          </SelectContent>
        </Select>
        {errors.tutoring_format && (
          <p className="text-red-400 text-xs">{errors.tutoring_format.message}</p>
        )}
      </div>

      {/* Availability */}
      <div className="space-y-1.5">
        <Label htmlFor="availability_notes">Availability Notes</Label>
        <Input
          id="availability_notes"
          placeholder="e.g. Weekday evenings, Saturdays"
          {...register("availability_notes")}
        />
      </div>

      {/* Help needed */}
      <div className="space-y-1.5">
        <Label htmlFor="help_needed">What do you need help with?</Label>
        <Textarea
          id="help_needed"
          placeholder="Tell us about your goals, challenges, or anything that would help us find the right match..."
          {...register("help_needed")}
        />
      </div>

      {/* Consent */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-[#2a3a52] bg-[#0f1623]">
        <Checkbox
          id="consent"
          onCheckedChange={(checked) =>
            setValue("consent", checked === true, { shouldValidate: true })
          }
        />
        <Label htmlFor="consent" className="leading-relaxed cursor-pointer">
          I understand Nyx Scholars will contact me about tutoring options.
        </Label>
      </div>
      {errors.consent && (
        <p className="text-red-400 text-xs -mt-4">{errors.consent.message}</p>
      )}

      {serverError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Inquiry"
        )}
      </Button>

      <p className="text-[#4a5a6a] text-xs text-center">
        Nyx Scholars does not guarantee test score increases or admissions outcomes.
      </p>
    </form>
  );
}

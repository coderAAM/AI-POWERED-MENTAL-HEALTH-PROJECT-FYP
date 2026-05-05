import { Router, type IRouter } from "express";
import { ListDoctorsQueryParams, GetDoctorParams } from "@workspace/api-zod";
import { doctors } from "../data/doctors";

const router: IRouter = Router();

router.get("/doctors", (req, res) => {
  const params = ListDoctorsQueryParams.parse(req.query);
  let result = doctors.slice();

  if (params.city) {
    const city = params.city.toLowerCase();
    result = result.filter((d) => d.city.toLowerCase() === city);
  }
  if (params.specialty) {
    const sp = params.specialty.toLowerCase();
    result = result.filter((d) => d.specialty.toLowerCase() === sp);
  }

  res.json(result);
});

router.get("/doctors/cities", (_req, res) => {
  const cities = Array.from(new Set(doctors.map((d) => d.city))).sort();
  res.json(cities);
});

router.get("/doctors/specialties", (_req, res) => {
  const specialties = Array.from(new Set(doctors.map((d) => d.specialty))).sort();
  res.json(specialties);
});

router.get("/doctors/:id", (req, res) => {
  const params = GetDoctorParams.parse(req.params);
  const doctor = doctors.find((d) => d.id === params.id);
  if (!doctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }
  res.json(doctor);
});

export default router;

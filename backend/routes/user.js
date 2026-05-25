import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { supabase } from "../lib/supabase.js";

const router = Router();

// GET /api/user/me — protected route
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, created_at")
      .eq("id", req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// PUT /api/user/me — update name (protected)
router.put("/me", requireAuth, async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const { data: user, error } = await supabase
      .from("users")
      .update({ name })
      .eq("id", req.user.id)
      .select("id, email, name, created_at")
      .single();

    if (error) throw error;

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;

(() => {
  const steps = Array.from(document.querySelectorAll(".step"));
  const music = document.getElementById("bg-music");
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const answers = { feelings: [], regret: null, better: null };
  let current = 0;
  let musicStarted = false;
  let saved = false;

  function startMusic() {
    if (!music || musicStarted) return;
    music.volume = 0.85;
    const play = music.play();
    if (play && typeof play.then === "function") {
      play
        .then(() => {
          musicStarted = true;
        })
        .catch(() => {
          musicStarted = false;
        });
    } else {
      musicStarted = true;
    }
  }

  startMusic();
  document.addEventListener(
    "pointerdown",
    () => {
      startMusic();
    },
    { passive: true }
  );

  function showStep(index) {
    steps.forEach((step, i) => {
      const active = i === index;
      step.classList.toggle("is-active", active);
      if (active) {
        step.removeAttribute("hidden");
      } else {
        step.setAttribute("hidden", "");
      }
    });
    current = index;
  }

  async function saveResponse() {
    if (saved || !answers.better || !answers.regret) {
      return { ok: false, message: "Finish the choices first." };
    }
    saved = true;

    const { error } = await supabase.from("forgiveness_responses").insert({
      feelings: answers.feelings,
      regret_response: answers.regret,
      do_better: answers.better,
    });

    if (error) {
      saved = false;
      console.error("Could not save response:", error.message);
      return { ok: false, message: "Couldn't send right now. Try again." };
    }

    return { ok: true, message: "Sent, he'll see it soon ♡" };
  }

  function renderClosing() {
    const note = document.getElementById("closing-note");
    const headline = document.getElementById("closing-headline");
    const support = document.getElementById("closing-support");
    const better = answers.better || "";
    const regret = answers.regret || "";

    headline.textContent = "I will do better for you";

    const betterNotes = {
      "Be more present": "I'm here. Fully. You won't have to wonder.",
      "Communicate honestly": "No more hiding. You'll hear the truth from me.",
      "Don't make the same mistake": "I won't. That version of me ends here.",
    };

    const regretNotes = {
      "I hear that you regret it": "Thank you for hearing me. I mean every word.",
      "I'm still hurting, but I hear you": "Your hurt matters. I'll be gentle while you heal.",
      "I need time": "Take every second you need. I'm not going anywhere.",
      "I'm not ready yet": "That's okay. I'll wait with love, not pressure.",
    };

    support.textContent =
      betterNotes[better] ||
      regretNotes[regret] ||
      "You deserve that, and more. I love you.";
    note.hidden = false;
  }

  const sendBtn = document.getElementById("send-response");
  const sendStatus = document.getElementById("send-status");

  sendBtn?.addEventListener("click", async () => {
    if (sendBtn.disabled) return;
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending…";
    const result = await saveResponse();
    sendStatus.hidden = false;
    sendStatus.textContent = result.message;
    if (result.ok) {
      sendBtn.textContent = "Sent with love";
    } else {
      sendBtn.disabled = false;
      sendBtn.textContent = "Send to my love";
    }
  });

  document.querySelectorAll("[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      if (current < steps.length - 1) {
        showStep(current + 1);
      }
    });
  });

  document.querySelectorAll("[data-choice-group]").forEach((group) => {
    const key = group.getAttribute("data-choice-group");
    const nextBtn = group.closest(".step")?.querySelector("[data-next]");

    group.querySelectorAll(".choice").forEach((choice) => {
      choice.addEventListener("click", () => {
        if (choice.hasAttribute("data-tease")) {
          choice.classList.remove("is-bouncing");
          void choice.offsetWidth;
          choice.classList.add("is-bouncing");
          return;
        }

        group.querySelectorAll(".choice").forEach((c) => {
          c.classList.remove("is-selected");
          c.setAttribute("aria-selected", "false");
        });
        choice.classList.add("is-selected");
        choice.setAttribute("aria-selected", "true");
        answers[key] = choice.getAttribute("data-value");
        if (nextBtn) nextBtn.disabled = false;
        if (key === "better") renderClosing();
      });

      choice.addEventListener("animationend", () => {
        choice.classList.remove("is-bouncing");
      });
    });
  });

  document.querySelectorAll("[data-feelings]").forEach((group) => {
    const nextBtn = group.closest(".step")?.querySelector("[data-next]");
    const items = group.querySelectorAll("[data-feel]");

    items.forEach((item) => {
      item.addEventListener("click", () => {
        item.classList.toggle("is-selected");
        const text = item.textContent.trim();
        if (item.classList.contains("is-selected")) {
          if (!answers.feelings.includes(text)) {
            answers.feelings.push(text);
          }
        } else {
          answers.feelings = answers.feelings.filter((f) => f !== text);
        }
        if (nextBtn) {
          nextBtn.disabled = answers.feelings.length === 0;
        }
      });
    });
  });

  showStep(0);
})();

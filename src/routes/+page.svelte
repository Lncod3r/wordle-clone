<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";
  import { Confetti } from "svelte-confetti";
  import toast from "svelte-french-toast";

  export let data;
  const word = data.word;
  let guesses: any[] = [];
  let guess_row = 0;

  let win: any = null;
  let concluded = false;

  function setUp() {
    console.log(`La parola da indovinare è: ${word} `);
    guesses = []
    guess_row = 0
    concluded = false;
    addEventListener("keyup", (event) => {
      const key = event.key;
      const regex = /^[a-zA-Z]$/;

      if (regex.test(key)) handleKeyPress(key);
      else if (key === "Enter") handleEnter();
      if (key === "Backspace") {
        handelCancel();
      }
    });

    // populate guesses

    for (let i = 0; i < 5; i++) {
      guesses.push([]);
    }

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        guesses[i].push({ letter: "", color: "white" });
      }
    }

    guesses = guesses;
  }

  onMount(() => {
    setUp();
  });

  function handleKeyPress(key: string) {
    for (let i = 0; i < 5; i++) {
      if (guesses[guess_row][i].letter === "") {
        guesses[guess_row][i].letter = key;
        break;
      }
    }
  }

  function handelCancel() {
    for (let i = 0; i < 5; i++) {
      if (!guesses[guess_row][i + 1]) {
        guesses[guess_row][4].letter = "";
        break;
      }
      if (guesses[guess_row][i + 1].letter === "") {
        guesses[guess_row][i].letter = "";
      }
    }
  }

  function handleEnter() {
    let valid_submit = true;

    for (let i = 0; i < 5; i++) {
      if (guesses[guess_row][i].letter === "") {
        valid_submit = false;
      }
    }

    if (valid_submit) {
      for (let i = 0; i < 5; i++) {
        if (guesses[guess_row][i].letter === word[i]) {
          guesses[guess_row][i].color = "6BAA65";
        } else if (word.includes(guesses[guess_row][i].letter)) {
          guesses[guess_row][i].color = "C9B458";
        } else {
          guesses[guess_row][i].color = "797D7E";
        }
      }

      const winning = checkValidity();
      if (winning) {
        toast.success("Parola indovinata");
        win = true;
        concluded = true;
        return;
      }

      if (guess_row === 4) {
        toast.error(`La parola era ${word}`);
        concluded = true;
        return;
      }

      guess_row++;
    }
  }

  function checkValidity() {
    let valid = true;

    for (let i = 0; i < 5; i++) {
      if (guesses[guess_row][i].color !== "6BAA65") {
        valid = false;
      }
    }

    return valid;
  }

  function startGameAgain() {
    invalidateAll();
    setUp();
    concluded = false
    win = null

  }
</script>

<div class="h-full w-full flex justify-center items-center">
  <div class="flex flex-col">
    <h1 class="text-center font-poppins font-bold text-5xl my-5">Verble</h1>

    {#each guesses as guess}
      <div class="flex">
        {#each guess as letter}
          <div
            style="background-color: #{letter.letter ? letter.color : "white"}"
            class="border rounded border-gray-300 m-2 w-16 h-16 flex items-center justify-center transition"
          >
            <h1
              class="font-poppins font-bold text-3xl uppercase"
              style="color: {letter.color !== 'white' ? 'white' : 'black'}"
            >
              {letter.letter}
            </h1>
          </div>
        {/each}
      </div>
    {/each}

    <!-- {word} -->
    <div class="my-5 w-full h-10 flex items-center justify-center">
      {#if concluded}
        <button
          on:click={() => location.reload()}
          class="px-5 py-2 bg-blue-500 text-white rounded active:scale-75 transition font-poppins text-xl"
          >Lude iterum</button
        >
      {/if}
    </div>
  </div>
</div>

{#if win}
  <div
    style="position: fixed; top: -50px; left: 0; height: 100vh; width: 100vw; display: flex; justify-content: center; overflow: hidden; pointer-events: none;"
  >
    <Confetti
      x={[-5, 5]}
      y={[0, 0.1]}
      delay={[500, 2000]}
      infinite
      duration={5000}
      amount={200}
      fallDistance="100vh"
    />
  </div>
{/if}

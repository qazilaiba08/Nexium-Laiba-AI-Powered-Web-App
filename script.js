        const supabaseUrl = "https://crpskxbytvxfnfgxfdnz.supabase.co";
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycHNreGJ5dHZ4Zm5mZ3hmZG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzQ4OTEsImV4cCI6MjA2Njk1MDg5MX0.-9xm1y5rt-S7uRSzJX-3cSzVdqzfbnwAhWbLxNOEIaY";
        const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

        const signInBtn = document.getElementById('sign-in-btn');
        const signinView = document.getElementById('signin-view');
        const appView = document.getElementById('app-view');
        const emailInput = document.getElementById('email-input');
        const sendMagicLinkBtn = document.getElementById('send-magic-link');
        const authSection = document.getElementById('auth-section');
        const generateBtn = document.getElementById('generate-btn');
        const recipeResult = document.getElementById('recipe-result');

    
        async function checkAuth() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                showAppView(user);
            }
        }
function showAppView(user) {
        signinView.classList.add('hidden');
        appView.classList.remove('hidden');
        authSection.innerHTML = `
            <div class="flex items-center space-x-4">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoFZ5G0prHmBsDr8jkuvQ5cwMBX4IXf3g9Fg&s" alt="User avatar" class="rounded-full w-10 h-10 border-2 border-purple-400">
                <button id="sign-out-btn" class="text-gray-300 hover:text-purple-400 border-b border-gray-500 hover:border-purple-400 transition-colors">
                    Sign Out (${user.email})
                </button>
            </div>
        `;
        document.getElementById('sign-out-btn').addEventListener('click', signOut);
    }

    async function signIn() {
        const email = emailInput.value.trim();
        if (!email) {
            alert('Please enter a valid email address');
            return;
        }

        sendMagicLinkBtn.disabled = true;
        sendMagicLinkBtn.innerHTML = 'Sending magic link...';

        const { error } = await supabase.auth.signInWithOtp({
            email: email,
            options: { emailRedirectTo: window.location.origin }
        });

        if (error) {
            alert(error.message);
            sendMagicLinkBtn.disabled = false;
            sendMagicLinkBtn.innerHTML = 'Send Magic Link';
        } else {
            sendMagicLinkBtn.innerHTML = 'Check your email!';
            setTimeout(() => {
                sendMagicLinkBtn.disabled = false;
                sendMagicLinkBtn.innerHTML = 'Send Magic Link';
            }, 5000);
        }
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            signinView.classList.remove('hidden');
            appView.classList.add('hidden');
            authSection.innerHTML = `
                <button id="sign-in-btn" class="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:scale-105 transition-transform">
                    Sign In
                </button>
            `;
            document.getElementById('sign-in-btn').addEventListener('click', () => {
                signinView.classList.remove('hidden');
            });
        }
    }

    async function generateRecipe() {
        const mainIngredient = document.getElementById('main-ingredient').value.trim();
        if (!mainIngredient) {
            alert('Please enter at least one main ingredient');
            return;
        }

        const dietaryPref = document.getElementById('dietary-pref').value;
        const cuisineStyle = document.getElementById('cuisine-style').value;
        const additionalNotes = document.getElementById('additional-notes').value.trim();

        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="loading-dots">Generating</span>';

        // Simulate API call to n8n workflow
        setTimeout(() => {
            const mockRecipe = {
                title: `${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} ${cuisineStyle || ''} Recipe`.trim(),
                ingredients: [
                    `500g ${mainIngredient}`,
                    "1 onion, chopped",
                    "2 cloves garlic, minced",
                    "1 tbsp olive oil",
                    "Salt and pepper to taste",
                    dietaryPref === 'vegetarian' ? "Vegetarian cheese" : "",
                    dietaryPref === 'gluten-free' ? "Gluten-free flour" : ""
                ].filter(x => x),
                instructions: [
                    "Heat oil in a pan over medium heat.",
                    `Add ${mainIngredient} and cook until browned.`,
                    "Add onions and garlic, cook until softened.",
                    "Season with salt and pepper.",
                    additionalNotes.includes('quick') ? "Serve immediately." : "Simmer for 20 minutes.",
                    "Enjoy your delicious meal!"
                ],
                cookTime: additionalNotes.includes('quick') ? "15 min" : "35 min"
            };

            displayRecipe(mockRecipe);
            generateBtn.disabled = false;
            generateBtn.innerHTML = 'Generate Recipe';
        }, 2000);
    }

    function displayRecipe(recipe) {
        recipeResult.innerHTML = `
            <div class="w-full">
                <h3 class="text-2xl font-bold mb-4">${recipe.title}</h3>
                <div class="flex flex-wrap gap-8">
                    <div class="flex-1 min-w-[250px]">
                        <h4 class="text-lg font-semibold mb-2">Ingredients</h4>
                        <ul class="list-disc pl-5 space-y-1">
                            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="flex-1 min-w-[250px]">
                        <h4 class="text-lg font-semibold mb-2">Instructions</h4>
                        <ol class="list-decimal pl-5 space-y-2">
                            ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                        <div class="mt-4 p-3 bg-purple-800/30 rounded-lg">
                            <p class="text-purple-200 font-medium">Cook Time: ${recipe.cookTime}</p>
                        </div>
                        <button id="save-recipe-btn" class="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:scale-105 transition-transform">
                            Save Recipe
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('save-recipe-btn').addEventListener('click', () => saveRecipe(recipe));
    }

    async function saveRecipe(recipe) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        console.log('Recipe saved:', recipe);
        alert('Recipe saved to your collection!');

        document.getElementById('saved-recipes-section').classList.remove('hidden');
        const savedRecipesContainer = document.getElementById('saved-recipes');
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card bg-white rounded-lg shadow p-4 hover:shadow-md transition-all cursor-pointer';
        recipeCard.innerHTML = `
            <h4 class="font-bold mb-2">${recipe.title}</h4>
            <p class="text-sm text-gray-400 mb-2">${recipe.cookTime} • ${recipe.ingredients.length} ingredients</p>
        `;
        recipeCard.addEventListener('click', () => displayRecipe(recipe));
        savedRecipesContainer.prepend(recipeCard);
    }

        signInBtn.addEventListener('click', () => {
            signinView.classList.remove('hidden');
        });

        sendMagicLinkBtn.addEventListener('click', signIn);
        generateBtn.addEventListener('click', generateRecipe);

        checkAuth();
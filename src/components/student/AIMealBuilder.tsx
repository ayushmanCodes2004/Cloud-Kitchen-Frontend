import React, { useState, useEffect } from 'react';
import { customMealApi, AIMealGenerationRequest, AIMealGenerationResponse, CustomMealItemRequest } from '../../services/customMealApi';
import { subscriptionApi } from '../../services/subscriptionApi';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Save, 
  Lock, 
  Crown, 
  TrendingUp,
  Zap,
  Target,
  Brain,
  ChefHat,
  Clock,
  DollarSign,
  Star,
  Flame,
  Leaf,
  X
} from 'lucide-react';
import './AIMealBuilder.css';

const AIMealBuilder: React.FC = () => {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [budget, setBudget] = useState<number>(300);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [occasion, setOccasion] = useState('');
  const [aiResponse, setAiResponse] = useState<AIMealGenerationResponse | null>(null);
  const [savedMeals, setSavedMeals] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [customMealName, setCustomMealName] = useState('');
  const [savingMeal, setSavingMeal] = useState(false);

  const occasions = [
    'Post-workout',
    'Exam Preparation',
    'Late Night Study',
    'Sunday Brunch',
    'Party',
    'Quick Lunch',
    'Healthy Dinner',
  ];

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Non-Veg', 'Eggetarian', 'Jain'];

  const quickPrompts = [
    'I want something healthy for post-workout',
    'Create a meal for late night study session under ₹200',
    'Suggest a high protein meal',
    'I need energy boosting food',
    'Light dinner for better sleep',
    'Brain food for studying',
  ];

  useEffect(() => {
    checkSubscription();
    loadSavedMeals();
  }, []);

  const checkSubscription = async () => {
    setLoading(true);
    try {
      const subscription = await subscriptionApi.getActiveSubscription();
      setHasSubscription(subscription !== null);
    } catch (error) {
      console.error('Failed to check subscription:', error);
      setHasSubscription(false);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedMeals = async () => {
    try {
      const meals = await customMealApi.getMyCustomMeals();
      console.log('Loaded saved meals:', meals);
      setSavedMeals(meals);
    } catch (error) {
      console.error('Failed to load saved meals:', error);
      // Set empty array so the section still shows with empty state
      setSavedMeals([]);
    }
  };

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      setError('Please enter what you want');
      return;
    }

    setGenerating(true);
    setError('');
    setAiResponse(null);

    try {
      const request: AIMealGenerationRequest = {
        userInput,
        budget,
        dietaryPreferences,
        occasion: occasion || undefined,
      };

      const response = await customMealApi.generateAIMeal(request);
      setAiResponse(response);
      setCustomMealName(response.mealName); // Pre-fill with AI-generated name
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('AI Meal Builder is a premium feature. Please subscribe to Gold Plan to access this feature.');
      } else {
        setError(err.response?.data?.message || 'Failed to generate meal. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveMeal = async () => {
    if (!aiResponse) return;

    if (!customMealName.trim()) {
      alert('Please enter a name for your meal');
      return;
    }

    try {
      setSavingMeal(true);
      const items: CustomMealItemRequest[] = aiResponse.items.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        aiReason: item.reason,
      }));

      await customMealApi.createCustomMeal({
        name: customMealName.trim(),
        description: aiResponse.description,
        aiGenerated: true,
        aiPrompt: userInput,
        items,
      });

      alert('Meal saved successfully! You can order it anytime from Favourites → Saved Meals.');
      setShowSaveDialog(false);
      setCustomMealName('');
      loadSavedMeals();
    } catch (error) {
      alert('Failed to save meal. Please try again.');
    } finally {
      setSavingMeal(false);
    }
  };

  const handleOpenSaveDialog = () => {
    if (aiResponse) {
      setCustomMealName(aiResponse.mealName); // Pre-fill with AI name
      setShowSaveDialog(true);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setUserInput(prompt);
  };

  const toggleDietaryPreference = (pref: string) => {
    setDietaryPreferences(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!hasSubscription) {
    return (
      <div className="ai-meal-builder">
        <div className="premium-lock">
          <div className="lock-content">
            <div className="lock-icon-wrapper">
              <Lock className="lock-icon" size={48} />
            </div>
            <h2>Premium Feature</h2>
            <p>AI Meal Builder is exclusive to Gold Plan members</p>
            
            <div className="premium-features">
              <div className="feature-item">
                <Brain size={20} />
                <span>AI-Powered Recommendations</span>
              </div>
              <div className="feature-item">
                <Target size={20} />
                <span>Personalized Nutrition</span>
              </div>
              <div className="feature-item">
                <Zap size={20} />
                <span>Smart Meal Optimization</span>
              </div>
              <div className="feature-item">
                <TrendingUp size={20} />
                <span>Occasion-Based Meals</span>
              </div>
            </div>

            <button
              className="upgrade-button"
              onClick={() => window.location.href = '/student/subscription'}
            >
              <Crown size={20} />
              Upgrade to Gold Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-meal-builder">
      <div className="builder-header">
        <h1>🤖 AI Meal Builder</h1>
        <p>Tell me what you want, and I'll create the perfect meal for you!</p>
      </div>

      <div className="builder-content">
        {/* Input Section */}
        <div className="input-section">
          <div className="main-input">
            <label>What are you craving?</label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="E.g., I want something healthy for post-workout..."
              rows={4}
            />
          </div>

          <div className="quick-prompts">
            <label>⚡ Quick Prompts:</label>
            <div className="prompt-buttons">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="prompt-btn"
                  onClick={() => handleQuickPrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="filters">
            <div className="filter-group">
              <label>Budget: ₹{budget}</label>
              <input
                type="range"
                min="100"
                max="500"
                step="50"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
            </div>

            <div className="filter-group">
              <label>Dietary Preferences:</label>
              <div className="checkbox-group">
                {dietaryOptions.map((option) => (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={dietaryPreferences.includes(option)}
                      onChange={() => toggleDietaryPreference(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Occasion:</label>
              <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                <option value="">Select occasion (optional)</option>
                {occasions.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={generating || !userInput.trim()}
          >
            {generating ? '✨ Generating...' : '✨ Generate Meal'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>

        {/* AI Response Section */}
        {aiResponse && (
          <div className="ai-response">
            <div className="response-header">
              <h2>✨ {aiResponse.mealName}</h2>
              <div className="nutritional-score">
                Score: {aiResponse.nutritionalScore}/10 ⭐
              </div>
            </div>

            <p className="meal-description">{aiResponse.description}</p>

            <div className="meal-items">
              <h3>🍽️ Your Meal:</h3>
              {aiResponse.items.map((item, index) => (
                <div key={index} className="meal-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p className="item-reason">💡 {item.reason}</p>
                    <p className="item-chef">👨‍🍳 Chef: {item.chefName}</p>
                  </div>
                  <div className="item-price">
                    <span className="quantity">×{item.quantity}</span>
                    <span className="price">₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="nutritional-info">
              <h3>📊 Nutritional Information:</h3>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="label">Calories</span>
                  <span className="value">{aiResponse.nutritionalInfo.calories} kcal</span>
                </div>
                <div className="nutrition-item">
                  <span className="label">Protein</span>
                  <span className="value">{aiResponse.nutritionalInfo.protein}g</span>
                </div>
                <div className="nutrition-item">
                  <span className="label">Carbs</span>
                  <span className="value">{aiResponse.nutritionalInfo.carbs}g</span>
                </div>
                <div className="nutrition-item">
                  <span className="label">Fat</span>
                  <span className="value">{aiResponse.nutritionalInfo.fat}g</span>
                </div>
              </div>
            </div>

            <div className="meal-tags">
              {aiResponse.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="total-price">
              <span>Total Price:</span>
              <span className="price">₹{aiResponse.totalPrice.toFixed(2)}</span>
            </div>

            <div className="action-buttons">
              <button className="save-btn" onClick={handleOpenSaveDialog}>
                💾 Save Meal
              </button>
              <button className="regenerate-btn" onClick={handleGenerate}>
                🔄 Regenerate
              </button>
            </div>
          </div>
        )}

        {/* Saved Meals Section - Always Visible */}
        <div className="saved-meals" style={{ marginTop: '40px', padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
          <h2 style={{ marginBottom: '20px' }}>📚 Your Saved Meals ({savedMeals.length})</h2>
          {savedMeals.length > 0 ? (
            <div className="meals-grid">
              {savedMeals.map((meal) => (
                <div key={meal.id} className="saved-meal-card">
                  <div className="meal-header">
                    <h3>{meal.name}</h3>
                    {meal.aiGenerated && <span className="ai-badge">🤖 AI</span>}
                  </div>
                  <p className="meal-desc">{meal.description}</p>
                  <div className="meal-stats">
                    <span>₹{meal.totalPrice}</span>
                    <span>Ordered {meal.timesOrdered} times</span>
                  </div>
                  {meal.nutritionalScore && (
                    <div className="score">Score: {meal.nutritionalScore}/10 ⭐</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-saved-meals" style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '10px' }}>
              <p style={{ fontSize: '1.2rem', color: '#666', margin: '0 0 10px 0' }}>No Saved Meals Yet</p>
              <p className="empty-subtitle" style={{ fontSize: '1rem', color: '#999' }}>Create your first AI-powered meal and save it for quick ordering!</p>
            </div>
          )}
        </div>
      </div>

      {/* Save Meal Dialog */}
      {showSaveDialog && (
        <div className="modal-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="save-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>💾 Save Your Meal</h2>
              <button
                className="close-dialog-btn"
                onClick={() => setShowSaveDialog(false)}
              >
                ×
              </button>
            </div>
            
            <div className="dialog-content">
              <p className="dialog-description">
                Give your meal a custom name to easily find it later in Favourites → Saved Meals
              </p>
              
              <div className="input-group">
                <label htmlFor="meal-name">Meal Name</label>
                <input
                  id="meal-name"
                  type="text"
                  value={customMealName}
                  onChange={(e) => setCustomMealName(e.target.value)}
                  placeholder="e.g., My Post-Workout Power Meal"
                  maxLength={100}
                  autoFocus
                />
                <span className="char-count">{customMealName.length}/100</span>
              </div>

              {aiResponse && (
                <div className="meal-preview">
                  <h4>📋 Meal Preview:</h4>
                  <p className="preview-description">{aiResponse.description}</p>
                  <div className="preview-items">
                    <strong>{aiResponse.items.length} items</strong> • 
                    <strong> ₹{aiResponse.totalPrice.toFixed(2)}</strong> • 
                    <strong> {aiResponse.nutritionalScore}/10 ⭐</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="dialog-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowSaveDialog(false)}
                disabled={savingMeal}
              >
                Cancel
              </button>
              <button
                className="confirm-save-btn"
                onClick={handleSaveMeal}
                disabled={savingMeal || !customMealName.trim()}
              >
                {savingMeal ? '💾 Saving...' : '💾 Save Meal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMealBuilder;

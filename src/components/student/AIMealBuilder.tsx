import React, { useState, useEffect } from 'react';
import { customMealApi, AIMealGenerationRequest, AIMealGenerationResponse, CustomMealItemRequest } from '../../services/customMealApi';
import { subscriptionApi } from '../../services/subscriptionApi';
import { 
  Sparkles, Send, RefreshCw, Save, Lock, Crown,
  TrendingUp, Zap, Target, Brain, ChefHat,
  Star, X
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
    'Post-workout', 'Exam Preparation', 'Late Night Study',
    'Sunday Brunch', 'Party', 'Quick Lunch', 'Healthy Dinner'
  ];

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Non-Veg', 'Eggetarian', 'Jain'];

  const quickPrompts = [
    'High protein post-workout meal',
    'Light healthy dinner under ₹200',
    'Energy boosting study snack',
    'Quick filling lunch'
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
      setCustomMealName(response.mealName);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('AI Meal Builder is a premium feature. Please subscribe to Gold Plan.');
      } else {
        setError(err.response?.data?.message || 'Failed to generate meal. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenSaveDialog = () => {
    if (aiResponse) {
      setCustomMealName(aiResponse.mealName);
      setShowSaveDialog(true);
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

      alert('Meal saved! Find it in Favourites → Saved Meals.');
      setShowSaveDialog(false);
      setCustomMealName('');
      loadSavedMeals();
    } catch (error) {
      alert('Failed to save meal. Please try again.');
    } finally {
      setSavingMeal(false);
    }
  };

  const toggleDietaryPreference = (pref: string) => {
    setDietaryPreferences(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  if (loading) {
    return <div className="loading-state">Loading...</div>;
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
      {/* Header */}
      <div className="page-header">
        <img src="/best.png" alt="PlatePal" className="logo" />
        <h1>PlatePal</h1>
      </div>

      {/* Main Container */}
      <div className="main-container">
        
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <Sparkles size={32} />
          <div className="welcome-content">
            <h2>AI-Powered Meal Recommendations</h2>
            <p>Tell us what you're craving, your budget, and dietary preferences. Our AI will create the perfect meal combination just for you!</p>
          </div>
        </div>
        
        {/* Input Section */}
        <div className="section">
          <div className="section-title">
            <Brain size={18} />
            <span>What do you want?</span>
          </div>
          
          <textarea
            className="simple-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="E.g., I want a high-protein meal for post-workout under ₹300..."
            rows={3}
          />

          <div className="quick-chips">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                className="quick-chip"
                onClick={() => setUserInput(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="section">
          <div className="section-title">
            <Target size={18} />
            <span>Preferences</span>
          </div>

          <div className="inline-control">
            <label>Budget</label>
            <input
              type="range"
              min="100"
              max="500"
              step="50"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
            <span className="value">₹{budget}</span>
          </div>

          <div className="inline-control">
            <label>Dietary</label>
            <div className="pills-row">
              {dietaryOptions.map((option) => (
                <label key={option} className={`pill ${dietaryPreferences.includes(option) ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={dietaryPreferences.includes(option)}
                    onChange={() => toggleDietaryPreference(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="inline-control">
            <label>Occasion</label>
            <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
              <option value="">Select (optional)</option>
              {occasions.map((occ) => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          className="generate-button"
          onClick={handleGenerate}
          disabled={generating || !userInput.trim()}
        >
          {generating ? (
            <>
              <RefreshCw size={20} className="spinning" />
              Generating...
            </>
          ) : (
            <>
              <Send size={20} />
              Generate Meal
            </>
          )}
        </button>

        {error && (
          <div className="error-banner">
            <X size={16} />
            {error}
          </div>
        )}

        {/* AI Response */}
        {aiResponse && (
          <div className="section">
            <div className="meal-header">
              <h2>{aiResponse.mealName}</h2>
              <span className="score-badge">
                <Star size={14} />
                {aiResponse.nutritionalScore}/10
              </span>
            </div>

            <p className="meal-desc">{aiResponse.description}</p>

            <div className="items-list">
              {aiResponse.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-meta">
                      <ChefHat size={12} />
                      {item.chefName} • Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="item-price">₹{item.price}</div>
                </div>
              ))}
            </div>

            <div className="nutrition-compact">
              <div className="nut-item">
                <span className="label">Calories</span>
                <span className="value">{aiResponse.nutritionalInfo.calories}</span>
              </div>
              <div className="nut-item">
                <span className="label">Protein</span>
                <span className="value">{aiResponse.nutritionalInfo.protein}g</span>
              </div>
              <div className="nut-item">
                <span className="label">Carbs</span>
                <span className="value">{aiResponse.nutritionalInfo.carbs}g</span>
              </div>
              <div className="nut-item">
                <span className="label">Fat</span>
                <span className="value">{aiResponse.nutritionalInfo.fat}g</span>
              </div>
            </div>

            <div className="tags-row">
              {aiResponse.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>

            <div className="total-row">
              <span>Total Amount</span>
              <span className="total-price">₹{aiResponse.totalPrice.toFixed(2)}</span>
            </div>

            <div className="action-row">
              <button className="btn-save" onClick={handleOpenSaveDialog}>
                <Save size={16} />
                Save Meal
              </button>
              <button className="btn-regenerate" onClick={handleGenerate}>
                <RefreshCw size={16} />
                Regenerate
              </button>
            </div>
          </div>
        )}

        {/* Saved Meals */}
        <div className="section">
          <div className="section-title">
            <Sparkles size={18} />
            <span>Your Saved Meals</span>
            {savedMeals.length > 0 && (
              <span className="count-badge">({savedMeals.length})</span>
            )}
          </div>

          {savedMeals.length === 0 ? (
            <div className="empty-state">
              <p>No saved meals yet</p>
              <p className="empty-subtitle">Generate and save your first AI meal!</p>
            </div>
          ) : (
            <div className="saved-grid">
              {savedMeals.map((meal) => (
                <div key={meal.id} className="saved-card">
                  <div className="saved-header">
                    <h4>{meal.name}</h4>
                    {meal.aiGenerated && (
                      <span className="ai-badge">
                        <Sparkles size={12} />
                        AI
                      </span>
                    )}
                  </div>
                  <p className="saved-desc">{meal.description}</p>
                  <div className="saved-footer">
                    <span className="saved-price">₹{meal.totalPrice}</span>
                    {meal.nutritionalScore && (
                      <span className="saved-score">
                        <Star size={12} />
                        {meal.nutritionalScore}/10
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="modal-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="save-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Save Your Meal</h2>
              <button className="close-dialog-btn" onClick={() => setShowSaveDialog(false)}>
                ×
              </button>
            </div>
            
            <div className="dialog-content">
              <p className="dialog-description">
                Give your meal a custom name to find it easily later
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
                  <h4>Meal Preview</h4>
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
                {savingMeal ? 'Saving...' : 'Save Meal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMealBuilder;

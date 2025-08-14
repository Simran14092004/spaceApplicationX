from flask import Flask, render_template, jsonify, request, redirect, url_for, send_from_directory
import os
import json
from datetime import datetime
import logging

# Initialize Flask app
app = Flask(__name__, static_folder='.', static_url_path='')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for articles (in production, use a database)
articles = [
    {
        "title": "BLACK HOLE",
        "subtitle": "#The_Truth_Unfolded...",
        "image": "images_used/cloudyblackhole.jpeg",
        "full_content": """
<h4>The Mysteries of Black Holes</h4>
<p>Black holes are among the most fascinating and mysterious objects in the universe. These cosmic phenomena represent regions of spacetime where gravity is so intense that nothing, not even light, can escape once it crosses the event horizon.</p>
<h5>Formation and Types</h5>
<p>Black holes form when massive stars exhaust their nuclear fuel and collapse under their own gravity. There are three main types:</p>
<ul>
  <li><strong>Stellar-mass black holes:</strong> Formed from collapsed stars, typically 3-20 solar masses</li>
  <li><strong>Supermassive black holes:</strong> Found at galaxy centers, millions to billions of solar masses</li>
  <li><strong>Intermediate black holes:</strong> Rarer type with masses between stellar and supermassive</li>
</ul>
<h5>Key Phenomena</h5>
<p><strong>Spaghettification:</strong> The stretching effect experienced by objects approaching a black hole due to extreme gravitational gradients.</p>
<p><strong>Hawking Radiation:</strong> Theoretical radiation proposed by Stephen Hawking, suggesting black holes can slowly evaporate over time.</p>
<p><strong>Time Dilation:</strong> Clocks near black holes run slower relative to distant observers due to gravitational time dilation.</p>
<h5>Recent Discoveries</h5>
<p>The Event Horizon Telescope collaboration provided the first direct image of a black hole's event horizon in 2019, specifically the supermassive black hole at the center of galaxy M87.</p>
""",
        "author": "Simran Singh",
        "date": "2025-08-12",
        "tags": ["Black Hole", "Space", "Physics"]
    },
    {
        "title": "ISRO",
        "subtitle": "#Triumph_&_Missions...",
        "image": "images_used/astronaut_article.jpeg",
        "full_content": """
<h4>ISRO: India's Space Odyssey</h4>
<p>The Indian Space Research Organisation (ISRO) has emerged as a global leader in cost-effective space exploration, achieving remarkable milestones that have positioned India as a key player in the international space community.</p>
<h5>Major Missions</h5>
<p><strong>Chandrayaan Missions:</strong> India's lunar exploration program has provided crucial insights into the Moon's composition and water ice presence.</p>
<p><strong>Mangalyaan (Mars Orbiter Mission):</strong> India's first interplanetary mission, making ISRO the fourth space agency to reach Mars orbit.</p>
<p><strong>Gaganyaan:</strong> India's ambitious human spaceflight program aiming to send astronauts to low Earth orbit.</p>
<h5>Technological Innovations</h5>
<p>ISRO's cost-effective approach has revolutionized space exploration economics, achieving complex missions at a fraction of typical costs. The organization has developed indigenous technologies including cryogenic engines, navigation systems, and satellite platforms.</p>
<h5>Future Endeavors</h5>
<p>Upcoming missions include Aditya-L1 (solar observation), Chandrayaan-3 follow-up missions, and the establishment of India's own space station by 2030.</p>
""",
        "author": "Simran Singh",
        "date": "2025-08-12",
        "tags": ["ISRO", "India", "Space"]
    },
    {
        "title": "NASA",
        "subtitle": "#Future_Missions...",
        "image": "images_used/rocket_article1.jpg",
        "full_content": """
<h4>NASA's Future Space Exploration</h4>
<p>The National Aeronautics and Space Administration continues to push the boundaries of human knowledge and technological capability through ambitious missions that span our solar system and beyond.</p>
<h5>Artemis Program</h5>
<p>NASA's Artemis program aims to return humans to the Moon by 2026, establishing a sustainable lunar presence. This includes the first woman and next man on the lunar surface, with plans for a lunar gateway station.</p>
<h5>Mars Exploration</h5>
<p>The Perseverance rover continues its mission on Mars, searching for signs of ancient microbial life and collecting samples for future return to Earth. The Ingenuity helicopter has exceeded all expectations, demonstrating powered flight on another planet.</p>
<h5>Asteroid Studies</h5>
<p>The Psyche mission will study a unique metal-rich asteroid, providing insights into planetary cores and the formation of rocky planets. The DART mission successfully demonstrated asteroid deflection technology.</p>
<h5>Solar System Exploration</h5>
<p>The Parker Solar Probe continues its journey closer to the Sun than any previous spacecraft, while missions to Jupiter's moons and Saturn's system expand our understanding of these fascinating worlds.</p>
""",
        "author": "Simran Singh",
        "date": "2025-08-12",
        "tags": ["NASA", "Space", "Exploration"]
    },
    {
        "title": "ANOTHER SOLAR SYSTEM",
        "subtitle": "#Is_Someone_There...",
        "image": "images_used/solar_slide.jpeg",
        "full_content": """
<h4>The TOI-700 Solar System: A New Hope for Life</h4>
<p>Located approximately 100 light-years away in the constellation Dorado, the TOI-700 solar system represents one of the most promising candidates for potentially habitable exoplanets discovered to date.</p>
<h5>System Architecture</h5>
<p>The TOI-700 system consists of three confirmed planets orbiting a cool M-dwarf star:</p>
<ul>
  <li><strong>TOI-700 b:</strong> Innermost planet, likely rocky and tidally locked</li>
  <li><strong>TOI-700 c:</strong> Middle planet with potential for atmospheric studies</li>
  <li><strong>TOI-700 d:</strong> The jewel of the system, located in the habitable zone</li>
</ul>
<h5>TOI-700 d: The Habitable Zone Planet</h5>
<p>This Earth-sized planet orbits within the star's habitable zone, where liquid water could potentially exist on the surface. Key characteristics include:</p>
<ul>
  <li>37-day orbital period</li>
  <li>Receives 86% of the stellar energy Earth receives from the Sun</li>
  <li>Potential for liquid water oceans</li>
  <li>Atmospheric conditions suitable for life as we know it</li>
</ul>
<h5>Implications for Life</h5>
<p>The discovery of TOI-700 d represents a significant milestone in the search for habitable worlds beyond our solar system. Its location in the habitable zone, combined with its Earth-like size, makes it an excellent target for future atmospheric studies and the search for biosignatures.</p>
<h5>Future Observations</h5>
<p>The James Webb Space Telescope and upcoming missions will provide detailed atmospheric analysis, potentially revealing the presence of water vapor, oxygen, or other indicators of habitability.</p>
""",
        "author": "Simran Singh",
        "date": "2025-08-12",
        "tags": ["Exoplanet", "TOI-700", "Astronomy"]
    }
]

# In-memory storage for email subscriptions
subscribers = []

# Routes
@app.route('/')
def index():
    """Serve the index.html page"""
    return send_from_directory('.', 'index.html')

@app.route('/article')
def article():
    """Serve the article.html page"""
    return send_from_directory('.', 'article.html')

@app.route('/api/articles')
def get_articles():
    """Get all articles with optional filtering"""
    category = request.args.get('category')
    search = request.args.get('search')
    
    filtered_articles = articles
    
    if category:
        filtered_articles = [a for a in filtered_articles if a['category'].lower() == category.lower()]
    
    if search:
        search_term = search.lower()
        filtered_articles = [a for a in filtered_articles 
                          if search_term in a['title'].lower() or 
                             search_term in a['content'].lower() or
                             any(search_term in tag.lower() for tag in a['tags'])]
    
    return jsonify(filtered_articles)

@app.route('/api/articles/<int:article_id>')
def get_article(article_id):
    """Get a specific article by ID"""
    article = next((a for a in articles if a['id'] == article_id), None)
    if article:
        return jsonify(article)
    return jsonify({"error": "Article not found"}), 404



@app.route('/services')
def services():
    """Serve the services.html page"""
    return send_from_directory('.', 'services.html')


@app.route('/auth-modal')
def auth_modal():
    return send_from_directory('.', 'auth-modal.html')


# In-memory storage for users
users = []

@app.route('/api/signup', methods=['POST'])
def signup():
    """Handle user signup"""
    try:
        data = request.get_json()
        email = data.get('email')
        first_name = data.get('firstName', '')
        last_name = data.get('lastName', '')
        password = data.get('password', '')

        if not email:
            return jsonify({"error": "Email is required"}), 400

        if not password:
            return jsonify({"error": "Password is required"}), 400

        # Check if user already exists
        if any(u['email'] == email for u in users):
            return jsonify({"message": "User already exists"}), 409

        # Add new user
        users.append({
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "password": password,  # In production, hash passwords!
            "signed_up_at": datetime.now().isoformat()
        })

        logger.info(f"New user signed up: {email}")
        return jsonify({"message": "Signup successful", "user": {"email": email, "first_name": first_name, "last_name": last_name}}), 201

    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        return jsonify({"error": "Signup failed"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Handle user login"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email:
            return jsonify({"error": "Email is required"}), 400

        if not password:
            return jsonify({"error": "Password is required"}), 400

        # Find user by email and password
        user = next((u for u in users if u['email'] == email and u['password'] == password), None)
        
        if not user:
            return jsonify({"message": "Invalid email or password"}), 401

        logger.info(f"User logged in: {email}")
        return jsonify({
            "message": "Login successful",
            "user": {
                "email": user['email'],
                "first_name": user['first_name'],
                "last_name": user['last_name']
            }
        }), 200

    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({"error": "Login failed"}), 500



@app.route('/api/categories')
def get_categories():
    """Get all unique categories"""
    categories = list(set(a['category'] for a in articles))
    return jsonify(categories)

@app.route('/api/subscribe', methods=['POST'])
def subscribe():
    """Handle email subscriptions"""
    try:
        data = request.get_json()
        email = data.get('email')
        first_name = data.get('firstName', '')
        last_name = data.get('lastName', '')
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        # Check if email already exists
        if any(s['email'] == email for s in subscribers):
            return jsonify({"message": "Email already subscribed"}), 200
        
        # Add new subscriber
        subscribers.append({
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "subscribed_at": datetime.now().isoformat()
        })
        
        logger.info(f"New subscriber: {email}")
        return jsonify({"message": "Successfully subscribed"}), 201
        
    except Exception as e:
        logger.error(f"Subscription error: {str(e)}")
        return jsonify({"error": "Subscription failed"}), 500

@app.route('/api/contact', methods=['POST'])
def contact():
    """Handle contact form submissions"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        logger.info(f"Contact form submission from: {email}")
        return jsonify({"message": "Thank you for your message! We'll get back to you soon."}), 200
        
    except Exception as e:
        logger.error(f"Contact form error: {str(e)}")
        return jsonify({"error": "Failed to send message"}), 500

@app.route('/api/stats')
def get_stats():
    """Get website statistics"""
    stats = {
        "total_articles": len(articles),
        "total_subscribers": len(subscribers),
        "categories": len(set(a['category'] for a in articles)),
        "most_recent_article": max(articles, key=lambda x: x['date'])['date']
    }
    return jsonify(stats)

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Page not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'True').lower() == 'true'
    
    logger.info(f"Starting Space Explorer backend on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)

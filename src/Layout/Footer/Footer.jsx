import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Footer.scss';

function Footer() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [restaurantSettings, setRestaurantSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Platform ikonlarını map etmək üçün
  const socialIconMap = {
    instagram: 'fab fa-instagram',
    facebook: 'fab fa-facebook-f',
    twitter: 'fab fa-twitter',
    tiktok: 'fab fa-tiktok',
    youtube: 'fab fa-youtube',
    linkedin: 'fab fa-linkedin-in',
    telegram: 'fab fa-telegram-plane',
  };

  useEffect(() => {
    const fetchRestaurantSettings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/restaurant/settings/`);
        setRestaurantSettings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Footer məlumatları yüklənə bilmədi:", error);
        setLoading(false);
      }
    };

    fetchRestaurantSettings();
  }, []);

  if (loading || !restaurantSettings) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          {restaurantSettings.restaurant_name && (
            <h3 className='restaurantsName'>{restaurantSettings.restaurant_name}</h3>
          )}
          {restaurantSettings.slogan && (
            <p className='restaurantsSlogan'>{restaurantSettings.slogan}</p>
          )}
          {restaurantSettings.social_networks && restaurantSettings.social_networks.length > 0 && (
            <div className="social-icons">
              {restaurantSettings.social_networks.map((social) => (
                <a 
                  key={social.id} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                >
                  <i className={socialIconMap[social.platform]}></i>
                </a>
              ))}
            </div>
          )}
        </div>
        
        <div className="footer-section">
          <h4>Menyu</h4>
          <ul>
            <li><a href="#">Ana Səhifə</a></li>
            <li><a href="#">Məhsullar</a></li>
          </ul>
        </div>
        
        {(restaurantSettings.location_text || restaurantSettings.phone || restaurantSettings.email) && (
          <div className="footer-section">
            <h4>Əlaqə</h4>
            <ul className="contact-info">
              {restaurantSettings.location_text && (
                <li><i className="fas fa-map-marker-alt"></i> {restaurantSettings.location_text}</li>
              )}
              {restaurantSettings.phone && (
                <li><i className="fas fa-phone"></i> {restaurantSettings.phone}</li>
              )}
              {restaurantSettings.email && (
                <li><i className="fas fa-envelope"></i> {restaurantSettings.email}</li>
              )}
            </ul>
          </div>
        )}
        
        {restaurantSettings.work_hours && (
          <div className="footer-section">
            <h4>İş Saatları</h4>
            <ul>
              <li>{restaurantSettings.work_hours}</li>
            </ul>
          </div>
        )}
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 {restaurantSettings.restaurant_name || 'Restoran'}. Bütün hüquqlar qorunur. Created by <span>Diyes MMC</span></p>
      </div>
    </footer>
  );
}

export default Footer;

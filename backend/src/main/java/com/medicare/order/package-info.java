/**
 * Package: com.medicare.order
 * 
 * Boundary Note for MediCare / MediFinder Architecture:
 * For the initial MVP, MediCare routes medicine purchasing directly to verified online
 * partner pharmacies (such as Tata 1mg, PharmEasy, Netmeds, Apollo Pharmacy) via their
 * direct verified product URLs provided by the RetailerOffer entity.
 * 
 * Internal order management, shopping carts, and prescription order fulfillment workflows
 * are architected to be plugged into this module in future phases without breaking
 * the current medicine catalogue contracts.
 */
package com.medicare.order;

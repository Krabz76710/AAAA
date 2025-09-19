import React, { useState } from 'react';
import { Car, Plus, X, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Vehicle } from '../types';
import { getVehicleInfoByPlate } from '../services/vehicleService';

interface VehicleManagerProps {
  vehicles: Vehicle[];
  onChange: (vehicles: Vehicle[]) => void;
}

export const VehicleManager: React.FC<VehicleManagerProps> = ({ vehicles, onChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Partial<Vehicle>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [plateError, setPlateError] = useState('');

  const handlePlateChange = async (plate: string) => {
    setCurrentVehicle({ ...currentVehicle, licensePlate: plate.toUpperCase() });
    setPlateError('');

    if (plate.length >= 7) {
      setIsLoading(true);
      try {
        const vehicleInfo = await getVehicleInfoByPlate(plate);
        if (vehicleInfo) {
          setCurrentVehicle({
            ...currentVehicle,
            licensePlate: plate.toUpperCase(),
            ...vehicleInfo
          });
        }
      } catch (error) {
        setPlateError('Impossible de récupérer les informations du véhicule');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddVehicle = () => {
    if (currentVehicle.licensePlate && currentVehicle.brand && currentVehicle.model) {
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        licensePlate: currentVehicle.licensePlate,
        brand: currentVehicle.brand,
        model: currentVehicle.model,
        color: currentVehicle.color || '',
        year: currentVehicle.year,
        fuelType: currentVehicle.fuelType || 'essence',
        power: currentVehicle.power,
        dimensions: currentVehicle.dimensions || { length: 0, width: 0, height: 0 },
        weight: currentVehicle.weight,
        category: currentVehicle.category || 'voiture',
        insurance: currentVehicle.insurance,
        technicalControl: currentVehicle.technicalControl
      };

      onChange([...vehicles, newVehicle]);
      setCurrentVehicle({});
      setShowModal(false);
    }
  };

  const handleRemoveVehicle = (vehicleId: string) => {
    onChange(vehicles.filter(v => v.id !== vehicleId));
  };

  const vehicleCategories = {
    'voiture': 'Voiture',
    'utilitaire': 'Utilitaire',
    'camion': 'Camion',
    'moto': 'Moto',
    'remorque': 'Remorque',
    'semi_remorque': 'Semi-remorque'
  };

  const fuelTypes = {
    'essence': 'Essence',
    'diesel': 'Diesel',
    'electrique': 'Électrique',
    'hybride': 'Hybride',
    'gpl': 'GPL',
    'autre': 'Autre'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Car className="w-5 h-5" />
          Véhicules
        </h3>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Ajouter un véhicule
        </button>
      </div>

      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{vehicle.licensePlate}</h4>
                    <p className="text-sm text-gray-500">
                      {vehicle.brand} {vehicle.model} {vehicle.year && `(${vehicle.year})`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveVehicle(vehicle.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                {vehicle.color && (
                  <div>
                    <span className="font-medium">Couleur:</span> {vehicle.color}
                  </div>
                )}
                {vehicle.category && (
                  <div>
                    <span className="font-medium">Type:</span> {vehicleCategories[vehicle.category]}
                  </div>
                )}
                {vehicle.power && (
                  <div>
                    <span className="font-medium">Puissance:</span> {vehicle.power} CV
                  </div>
                )}
                {vehicle.fuelType && (
                  <div>
                    <span className="font-medium">Carburant:</span> {fuelTypes[vehicle.fuelType]}
                  </div>
                )}
              </div>

              {vehicle.dimensions && (vehicle.dimensions.length > 0 || vehicle.dimensions.width > 0 || vehicle.dimensions.height > 0) && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Dimensions:</span> {vehicle.dimensions.length}m × {vehicle.dimensions.width}m × {vehicle.dimensions.height}m
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Car className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Aucun véhicule ajouté</p>
          <p className="text-sm text-gray-400 mt-1">Ajoutez vos véhicules pour compléter votre profil</p>
        </div>
      )}

      {/* Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Ajouter un véhicule</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* License Plate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plaque d'immatriculation *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={currentVehicle.licensePlate || ''}
                    onChange={(e) => handlePlateChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
                    placeholder="AB-123-CD"
                    maxLength={9}
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                    </div>
                  )}
                </div>
                {plateError && (
                  <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {plateError}
                  </div>
                )}
                <div className="mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  <div className="flex items-center gap-1 mb-1">
                    <AlertCircle className="w-3 h-3" />
                    <span className="font-medium">Mode démonstration</span>
                  </div>
                  <p>Les données affichées sont simulées et ne correspondent pas au vrai véhicule. En production, une vraie API de véhicules serait utilisée.</p>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Vous pouvez modifier manuellement les informations ci-dessous
                </p>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marque *</label>
                  <input
                    type="text"
                    value={currentVehicle.brand || ''}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, brand: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Renault, Peugeot..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modèle *</label>
                  <input
                    type="text"
                    value={currentVehicle.model || ''}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, model: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Clio, 308..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                  <input
                    type="text"
                    value={currentVehicle.color || ''}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, color: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Blanc, Noir..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
                  <input
                    type="number"
                    value={currentVehicle.year || ''}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, year: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="2020"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Puissance (CV)</label>
                  <input
                    type="number"
                    value={currentVehicle.power || ''}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, power: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="90"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <select
                    value={currentVehicle.category || ''}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, category: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    {Object.entries(vehicleCategories).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Carburant</label>
                  <select
                    value={currentVehicle.fuelType || ''}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, fuelType: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    {Object.entries(fuelTypes).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Dimensions (mètres)</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      value={currentVehicle.dimensions?.length || ''}
                      onChange={(e) => setCurrentVehicle({
                        ...currentVehicle,
                        dimensions: {
                          ...currentVehicle.dimensions,
                          length: parseFloat(e.target.value) || 0,
                          width: currentVehicle.dimensions?.width || 0,
                          height: currentVehicle.dimensions?.height || 0
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Longueur"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      value={currentVehicle.dimensions?.width || ''}
                      onChange={(e) => setCurrentVehicle({
                        ...currentVehicle,
                        dimensions: {
                          length: currentVehicle.dimensions?.length || 0,
                          width: parseFloat(e.target.value) || 0,
                          height: currentVehicle.dimensions?.height || 0
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Largeur"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      value={currentVehicle.dimensions?.height || ''}
                      onChange={(e) => setCurrentVehicle({
                        ...currentVehicle,
                        dimensions: {
                          length: currentVehicle.dimensions?.length || 0,
                          width: currentVehicle.dimensions?.width || 0,
                          height: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Hauteur"
                    />
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Poids (kg)</label>
                <input
                  type="number"
                  value={currentVehicle.weight || ''}
                  onChange={(e) => setCurrentVehicle({ ...currentVehicle, weight: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="1500"
                />
              </div>

              {/* Insurance and Technical Control */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assurance (expiration)</label>
                  <input
                    type="date"
                    value={currentVehicle.insurance || ''}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, insurance: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contrôle technique (expiration)</label>
                  <input
                    type="date"
                    value={currentVehicle.technicalControl || ''}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, technicalControl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddVehicle}
                  disabled={!currentVehicle.licensePlate || !currentVehicle.brand || !currentVehicle.model}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    currentVehicle.licensePlate && currentVehicle.brand && currentVehicle.model
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Ajouter le véhicule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
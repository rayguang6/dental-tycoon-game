'use client';

import { Patient, Treatment, GameLog } from '../../gameData';
import PatientCard from '../game/PatientCard';
import TreatmentChair from '../game/TreatmentChair';
import EventLog from '../game/EventLog';

interface OperationsTabProps {
  patients: Patient[];
  treatments: Treatment[];
  chairs: number;
  logs: GameLog[];
}

export default function OperationsTab({ patients, treatments, chairs, logs }: OperationsTabProps) {
  return (
    <div className="space-y-6">
      {/* Three Column Layout: Waiting Room, Treatment Room, Event Log */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient Queue */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg border-2 border-amber-200">
          <div className="px-6 py-4 border-b border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-amber-800">🪑 Waiting Room</h3>
              <div className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                {patients.length} waiting
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            {patients.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🪑</div>
                <div className="text-amber-600 font-medium">Waiting room is empty</div>
                <div className="text-amber-500 text-sm">Patients will arrive soon!</div>
              </div>
            ) : (
              <div className="space-y-3">
                {patients.map((patient) => {
                  const timeWaiting = Math.floor((Date.now() - patient.createdAt) / 1000);
                  return (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      timeWaiting={timeWaiting}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Treatment Chairs */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-lg border-2 border-emerald-200">
          <div className="px-6 py-4 border-b border-emerald-200 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-emerald-800">🦷 Treatment Room</h3>
              <div className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                {treatments.length}/{chairs} active
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              {Array.from({ length: chairs }, (_, index) => {
                const treatment = treatments.find(t => t.chairId === index);
                return (
                  <TreatmentChair
                    key={index}
                    treatment={treatment || null}
                    chairIndex={index}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Event Log - Third Column */}
        <EventLog logs={logs} />
      </div>
    </div>
  );
}

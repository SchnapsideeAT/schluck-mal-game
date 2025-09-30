import { useState } from "react";
import { Player } from "@/types/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

interface PlayerSetupProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
}

const AVATAR_OPTIONS = [
  "😎", "🤠", "🥳", "😈", "🤡", "👻",
  "🐶", "🐱", "🦊", "🐼", "🐨", "🦁",
  "🍺", "🍻", "🍷", "🥂", "🍾", "🍹"
];

export const PlayerSetup = ({ players, onPlayersChange }: PlayerSetupProps) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      return;
    }

    if (players.length >= 10) {
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName.trim(),
      avatar: selectedAvatar,
      totalDrinks: 0,
    };

    onPlayersChange([...players, newPlayer]);
    setNewPlayerName("");
    setSelectedAvatar(AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)]);
  };

  const removePlayer = (playerId: string) => {
    onPlayersChange(players.filter(p => p.id !== playerId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addPlayer();
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Player Section */}
      <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Spieler hinzufügen</h3>
        
        {/* Avatar Selection */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Avatar wählen</label>
          <div className="grid grid-cols-6 gap-2">
            {AVATAR_OPTIONS.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`text-2xl p-3 rounded-lg transition-all flex items-center justify-center ${
                  selectedAvatar === avatar
                    ? "bg-primary/20 border-2 border-primary scale-110"
                    : "bg-muted/50 border border-border/30 hover:bg-muted hover:scale-105"
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Spielername..."
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={handleKeyPress}
            maxLength={20}
            className="flex-1"
          />
          <Button
            onClick={addPlayer}
            size="icon"
            className="shrink-0"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Players List */}
      {players.length > 0 && (
        <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            Spieler ({players.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between bg-muted/50 rounded-lg p-3 group hover:bg-muted transition-colors w-full"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{player.avatar}</span>
                  <span className="font-medium text-foreground">{player.name}</span>
                </div>
                <Button
                  onClick={() => removePlayer(player.id)}
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Minimum Players Warning */}
      {players.length < 3 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Mindestens 3 Spieler empfohlen (aktuell: {players.length})
          </p>
        </div>
      )}
    </div>
  );
};

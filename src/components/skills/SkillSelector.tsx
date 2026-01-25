import { Skill } from '@/types/scrypto';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillSelectorProps {
  skills: Skill[];
  selectedSkillIds: string[];
  onAdd: (skillId: string) => void;
  onRemove: (skillId: string) => void;
  loading?: boolean;
  title: string;
  description: string;
  emptyMessage: string;
  variant?: 'know' | 'want';
}

export function SkillSelector({
  skills,
  selectedSkillIds,
  onAdd,
  onRemove,
  loading,
  title,
  description,
  emptyMessage,
  variant = 'know'
}: SkillSelectorProps) {
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Selected skills */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-4 rounded-lg border border-dashed border-border bg-muted/30">
        {selectedSkillIds.length === 0 ? (
          <span className="text-sm text-muted-foreground">{emptyMessage}</span>
        ) : (
          selectedSkillIds.map(skillId => {
            const skill = skills.find(s => s.id === skillId);
            if (!skill) return null;
            return (
              <Badge
                key={skill.id}
                variant="secondary"
                className={cn(
                  'gap-1 pr-1',
                  variant === 'know' && 'bg-green-500/20 text-green-400 border-green-500/30',
                  variant === 'want' && 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                )}
              >
                {skill.name}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onRemove(skill.id)}
                  disabled={loading}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })
        )}
      </div>

      {/* Available skills by category */}
      <div className="space-y-4">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map(skill => {
                const isSelected = selectedSkillIds.includes(skill.id);
                return (
                  <Button
                    key={skill.id}
                    size="sm"
                    variant={isSelected ? 'secondary' : 'outline'}
                    onClick={() => isSelected ? onRemove(skill.id) : onAdd(skill.id)}
                    disabled={loading}
                    className={cn(
                      'gap-1',
                      isSelected && variant === 'know' && 'bg-green-500/20 text-green-400 border-green-500/30',
                      isSelected && variant === 'want' && 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    )}
                  >
                    {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    {skill.name}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

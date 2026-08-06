import React from 'react';
import {
  Folder,
  BookOpen,
  Brain,
  Scroll,
  Scale,
  Globe,
  FlaskConical,
  Lightbulb,
  Award,
  Home,
  LucideProps,
} from 'lucide-react';

export const ICON_OPTIONS = [
  { id: 'folder', label: 'Folder', Icon: Folder },
  { id: 'book', label: 'Book', Icon: BookOpen },
  { id: 'brain', label: 'Brain', Icon: Brain },
  { id: 'scroll', label: 'History / Scroll', Icon: Scroll },
  { id: 'scale', label: 'Polity / Law', Icon: Scale },
  { id: 'globe', label: 'Geography', Icon: Globe },
  { id: 'flask', label: 'Science / Lab', Icon: FlaskConical },
  { id: 'lightbulb', label: 'Aptitude / Logic', Icon: Lightbulb },
  { id: 'award', label: 'Exam / Award', Icon: Award },
];

interface FolderIconProps extends LucideProps {
  name?: string;
  className?: string;
  size?: number;
  color?: string;
}

export const RenderFolderIcon: React.FC<FolderIconProps> = ({
  name = 'folder',
  className = '',
  size = 18,
  color,
  ...props
}) => {
  const match = ICON_OPTIONS.find((item) => item.id === name || item.id === name.toLowerCase());
  const IconComponent = match ? match.Icon : Folder;

  return <IconComponent size={size} className={className} style={{ color }} {...props} />;
};

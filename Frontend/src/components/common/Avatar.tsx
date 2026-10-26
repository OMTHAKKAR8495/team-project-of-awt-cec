import React, { useState } from 'react';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'busy' | 'away' | 'offline';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  status,
  className = '',
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Compute initials from name (e.g. "John Doe" -> "JD")
  const getInitials = (fullName: string): string => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Deterministic background hue from name
  const getBgColor = (fullName: string): string => {
    const palette = [
      'bg-indigo-600 text-white',
      'bg-emerald-600 text-white',
      'bg-sky-600 text-white',
      'bg-violet-600 text-white',
      'bg-amber-600 text-white',
      'bg-rose-600 text-white',
      'bg-teal-600 text-white',
      'bg-cyan-600 text-white',
    ];

    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % palette.length;
    return palette[index];
  };

  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const statusSizeStyles = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-3.5 h-3.5 ring-2',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    busy: 'bg-rose-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-400',
  };

  const shouldShowImage = src && !imageFailed;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      title={name}
    >
      <div
        className={`rounded-full overflow-hidden flex items-center justify-center font-bold tracking-tight shadow-xs ${
          sizeStyles[size]
        } ${shouldShowImage ? 'bg-slate-100' : getBgColor(name)}`}
      >
        {shouldShowImage ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-white ${statusColors[status]} ${statusSizeStyles[size]}`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 4,
  size = 'md',
  className = '',
}) => {
  const childrenArray = React.Children.toArray(children);
  const total = childrenArray.length;
  const visibleAvatars = childrenArray.slice(0, max);
  const remainingCount = total - max;

  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px] -ml-1.5',
    sm: 'w-8 h-8 text-xs -ml-2',
    md: 'w-10 h-10 text-sm -ml-2.5',
    lg: 'w-12 h-12 text-base -ml-3',
    xl: 'w-16 h-16 text-xl -ml-4',
  };

  return (
    <div className={`flex items-center pl-2.5 ${className}`}>
      {visibleAvatars.map((child, index) => (
        <div key={index} className="first:ml-0 -ml-2.5 ring-2 ring-white rounded-full">
          {child}
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={`relative inline-flex items-center justify-center rounded-full bg-slate-100 border border-slate-200 font-semibold text-slate-600 ring-2 ring-white shrink-0 select-none ${sizeStyles[size]}`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default Avatar;

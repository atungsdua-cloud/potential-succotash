import { useState, useEffect } from 'react';
import { fetchSettings, updateSetting as apiUpdateSetting } from '../api';

export default function useSettings(defaults) {
  const [settings, setSettings] = useState(defaults);

  useEffect(() => {
    fetchSettings().then((data) => {
      if (data) setSettings((prev) => ({ ...prev, ...data }));
    }).catch(() => {});
  }, []);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    apiUpdateSetting(key, value).catch(() => {});
  };

  return [settings, update];
}

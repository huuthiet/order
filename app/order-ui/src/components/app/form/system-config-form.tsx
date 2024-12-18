import React from 'react';
import moment from 'moment';
import { CircleMinus, ChevronsLeftRight, PlusCircleIcon } from 'lucide-react';

import { Label, Input, Button, PasswordInput } from '@/components/ui';
import { useSystemConfigs } from '@/hooks';
import { ISystemConfig } from '@/types';
import { ConfigDropdown } from '@/app/system/config';

export const SystemConfigForm: React.FC = () => {
    const { data: systemConfigs } = useSystemConfigs();
    const [configs, setConfigs] = React.useState<ISystemConfig[]>([]);

    React.useEffect(() => {
        // Chỉ khởi tạo giá trị khi `systemConfigs` có dữ liệu
        if (systemConfigs?.result) {
            setConfigs(systemConfigs.result);
        }
    }, [systemConfigs]);

    const [newConfigs, setNewConfigs] = React.useState<ISystemConfig[]>([
        { key: '', value: '', slug: 'new-0', description: '', createdAt: new Date().toISOString() },
    ]);

    const addAnotherConfig = () => {
        setNewConfigs([
            ...newConfigs,
            { key: '', value: '', slug: `new-${newConfigs.length}`, description: '', createdAt: new Date().toISOString() },
        ]);
    };

    const removeConfig = (slug: string) => {
        const updatedConfigs = newConfigs.filter((config) => config.slug !== slug);
        setNewConfigs(updatedConfigs.length > 0 ? updatedConfigs : [
            { key: '', value: '', slug: 'new-0', description: '', createdAt: new Date().toISOString() },
        ]);
    };

    const handleInputChange = (slug: string, field: 'key' | 'value', value: string) => {
        setNewConfigs((prevConfigs) =>
            prevConfigs.map((config) =>
                config.slug === slug ? { ...config, [field]: value } : config
            )
        );
    };

    return (
        <div className="flex flex-col w-full gap-4">
            {/* Khu vực tạo mới */}
            <div className="pb-4 border-b border-gray-300">
                <h3 className="mb-4 text-lg font-semibold">Add New Configuration</h3>
                <div className="grid w-full gap-2">
                    {newConfigs.map((config) => (
                        <div className="grid grid-cols-12 gap-2 p-2 bg-white border rounded-md" key={config.slug}>
                            <div className="grid items-center w-full grid-cols-2 col-span-11 gap-2">
                                <div className="flex flex-col w-full gap-2">
                                    <Label>Key</Label>
                                    <Input
                                        value={config.key}
                                        onChange={(e) =>
                                            handleInputChange(config.slug, 'key', e.target.value)
                                        }
                                        placeholder="Enter key"
                                    />
                                </div>
                                <div className="flex flex-col w-full gap-2">
                                    <Label>Value</Label>
                                    <Input
                                        value={config.value}
                                        onChange={(e) =>
                                            handleInputChange(config.slug, 'value', e.target.value)
                                        }
                                        placeholder="Enter value"
                                    />
                                </div>
                            </div>
                            <div className="flex items-end w-full col-span-1 gap-2">
                                <Button
                                    className='w-full'
                                    variant="outline"
                                    onClick={() => removeConfig(config.slug)}
                                    title="Remove this config"
                                >
                                    <CircleMinus />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex justify-between'>
                    <Button variant="outline" onClick={addAnotherConfig} className="mt-4">
                        <PlusCircleIcon size={18} />
                        Thêm
                    </Button>
                    <Button onClick={addAnotherConfig} className="mt-4">
                        Lưu
                    </Button>
                </div>
            </div>

            {/* Danh sách config */}
            <div className="mt-6">
                <h3 className="mb-4 text-lg font-semibold">Configuration List</h3>
                {configs.length > 0 ? (
                    <div className="grid w-full gap-2">
                        {configs.map((config) => (
                            <div className="grid grid-cols-9 gap-2 p-2 bg-white border rounded-md" key={config.slug}>
                                <div className="grid items-center w-full grid-cols-1 col-span-8 gap-2">
                                    <div className='grid items-center w-full grid-cols-12 gap-2'>
                                        <div className='col-span-1 p-2 bg-gray-100 rounded-full w-fit h-fit'>
                                            <ChevronsLeftRight size={18} />
                                        </div>
                                        <span className='col-span-3 text-sm'>
                                            {config.key}
                                        </span>
                                        <span className='col-span-6'>
                                            <PasswordInput className='border-none' value={config.value} />
                                        </span>
                                        <span className='flex justify-end col-span-2 text-xs text-muted-foreground'>
                                            {moment(config.createdAt).format('hh:mm DD/MM/YYYY')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-end col-span-1 gap-2">
                                    <ConfigDropdown systemConfig={config} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No configurations found.</p>
                )}
            </div>
        </div>
    );
};

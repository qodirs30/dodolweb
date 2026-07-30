'use client';

import React from 'react';
import { Control, Controller, UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Question, QuestionOption } from '@/types/wizard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper to render Lucide icons dynamically
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.HelpCircle className={className} />;
  return <IconComponent className={className} />;
};

interface QuestionRendererProps {
  question: Question;
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  control,
  register,
  errors,
  setValue,
  watch,
}) => {
  const error = errors[question.id];
  const currentValue = watch(question.id);

  // Check if "other" option is selected in select, radio, or card-selector
  const isOtherSelected =
    currentValue === 'other' ||
    (Array.isArray(currentValue) && currentValue.includes('other'));

  const renderField = () => {
    switch (question.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
      case 'number':
        return (
          <Input
            id={question.id}
            type={question.type}
            placeholder={question.placeholder}
            className={cn(
              'h-12 bg-white dark:bg-zinc-950 transition-all rounded-lg border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:border-zinc-400',
              error && 'border-red-500 focus-visible:ring-red-400 focus-visible:border-red-400'
            )}
            {...register(question.id, { required: question.required })}
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={question.id}
            placeholder={question.placeholder}
            rows={4}
            className={cn(
              'bg-white dark:bg-zinc-950 transition-all rounded-lg border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:border-zinc-400',
              error && 'border-red-500 focus-visible:ring-red-400 focus-visible:border-red-400'
            )}
            {...register(question.id, { required: question.required })}
          />
        );

      case 'select':
        return (
          <Controller
            name={question.id}
            control={control}
            rules={{ required: question.required }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <SelectTrigger
                  className={cn(
                    'h-12 bg-white dark:bg-zinc-950 rounded-lg border-zinc-200',
                    error && 'border-red-500'
                  )}
                >
                  <SelectValue placeholder={question.placeholder || 'Select an option'} />
                </SelectTrigger>
                <SelectContent>
                  {question.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );

      case 'radio':
        return (
          <Controller
            name={question.id}
            control={control}
            rules={{ required: question.required }}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col gap-3"
              >
                {question.options?.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setValue(question.id, opt.value)}
                    className={cn(
                      'flex items-center space-x-3 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl cursor-pointer transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900',
                      field.value === opt.value && 'border-zinc-800 dark:border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/50'
                    )}
                  >
                    <RadioGroupItem value={opt.value} id={`${question.id}-${opt.value}`} />
                    <Label
                      htmlFor={`${question.id}-${opt.value}`}
                      className="cursor-pointer font-medium w-full"
                    >
                      {opt.label}
                      {opt.description && (
                        <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                          {opt.description}
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        );

      case 'switch':
        return (
          <Controller
            name={question.id}
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-3 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl">
                <Switch
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  id={question.id}
                />
                <Label htmlFor={question.id} className="cursor-pointer font-medium flex-1">
                  {question.title}
                  {question.description && (
                    <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                      {question.description}
                    </span>
                  )}
                </Label>
              </div>
            )}
          />
        );

      case 'multiselect':
        return (
          <Controller
            name={question.id}
            control={control}
            rules={{ required: question.required }}
            render={({ field }) => {
              const selectedValues: string[] = field.value || [];
              const handleToggle = (val: string) => {
                if (selectedValues.includes(val)) {
                  field.onChange(selectedValues.filter((v) => v !== val));
                } else {
                  field.onChange([...selectedValues, val]);
                }
              };

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {question.options?.map((opt) => {
                    const isSelected = selectedValues.includes(opt.value);
                    return (
                      <div
                        key={opt.value}
                        onClick={() => handleToggle(opt.value)}
                        className={cn(
                          'flex items-start space-x-3 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl cursor-pointer transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900',
                          isSelected && 'border-zinc-800 dark:border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/50'
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggle(opt.value)}
                          id={`${question.id}-${opt.value}`}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={`${question.id}-${opt.value}`}
                            className="text-sm font-semibold cursor-pointer"
                          >
                            {opt.label}
                          </label>
                          {opt.description && (
                            <p className="text-xs text-muted-foreground leading-normal">
                              {opt.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }}
          />
        );

      case 'card-selector':
        return (
          <Controller
            name={question.id}
            control={control}
            rules={{ required: question.required }}
            render={({ field }) => (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {question.options?.map((opt) => {
                  const isSelected = field.value === opt.value;
                  return (
                    <Card
                      key={opt.value}
                      onClick={() => field.onChange(opt.value)}
                      className={cn(
                        'cursor-pointer border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all premium-shadow-hover rounded-2xl overflow-hidden',
                        isSelected && 'border-zinc-900 dark:border-zinc-100 ring-1 ring-zinc-900 dark:ring-zinc-100 bg-zinc-50/30 dark:bg-zinc-900/30'
                      )}
                    >
                      <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
                        <div className="flex items-center justify-between">
                          <div className={cn(
                            'p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 transition-colors',
                            isSelected && 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                          )}>
                            {opt.icon && <DynamicIcon name={opt.icon} className="h-5 w-5" />}
                          </div>
                          {isSelected && (
                            <div className="h-5 w-5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
                              <Icons.Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{opt.label}</h4>
                          <p className="text-xs text-muted-foreground mt-1 leading-normal">{opt.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          />
        );

      case 'tags':
        return (
          <div className="flex flex-col gap-2">
            <Input
              id={question.id}
              placeholder={question.placeholder || 'Comma-separated values... e.g. Navy Blue, White, #FF5500'}
              className="h-12 bg-white dark:bg-zinc-950 rounded-lg border-zinc-200"
              {...register(question.id, { required: question.required })}
            />
            <p className="text-xs text-muted-foreground italic">Use commas to separate colors or tags.</p>
          </div>
        );

      case 'file-upload':
      case 'image-upload':
        return (
          <Controller
            name={question.id}
            control={control}
            render={({ field }) => {
              const files: File[] = field.value || [];

              const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                  const newFiles = Array.from(e.target.files);
                  field.onChange([...files, ...newFiles]);
                }
              };

              const removeFile = (index: number) => {
                field.onChange(files.filter((_, idx) => idx !== index));
              };

              return (
                <div className="flex flex-col gap-4">
                  <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-all flex flex-col items-center justify-center cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      id={question.id}
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900 mb-3">
                      <Icons.UploadCloud className="h-8 w-8 text-zinc-400" />
                    </div>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
                      Drag & drop your files here, or <span className="text-blue-500">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports PNG, JPG, WEBP, PDF, DOCX, ZIP (Max 50MB)
                    </p>
                  </div>

                  {files.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-semibold text-zinc-500">Selected Files ({files.length}):</p>
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between border border-zinc-100 dark:border-zinc-800 p-3 rounded-xl bg-zinc-50/30 dark:bg-zinc-900/20"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <Icons.File className="h-4 w-4 text-zinc-400 shrink-0" />
                            <div className="truncate">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500"
                          >
                            <Icons.X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }}
          />
        );

      default:
        return null;
    }
  };

  if (question.type === 'heading') {
    return (
      <div className="col-span-full py-4 border-b border-zinc-100 dark:border-zinc-900">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
          {question.title}
        </h2>
        {question.description && (
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {question.description}
          </p>
        )}
      </div>
    );
  }

  // Define column width classes based on question.width
  const widthClasses = {
    full: 'col-span-full',
    half: 'col-span-full md:col-span-1',
    third: 'col-span-full md:col-span-1 lg:col-span-1', // maps to 1/3 if parent has 3 cols
    quarter: 'col-span-full md:col-span-1 lg:col-span-1',
  };

  const colClass = widthClasses[question.width || 'full'];

  return (
    <div className={cn('flex flex-col gap-2.5', colClass)}>
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={question.id} className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {question.title}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {question.description && question.type !== 'switch' && (
          <p className="text-xs text-muted-foreground leading-normal mt-0.5">
            {question.description}
          </p>
        )}
      </div>

      {renderField()}

      {/* Render dynamic "other" input field if applicable */}
      {isOtherSelected && (
        <div className="mt-2 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800">
          <Label className="text-xs font-semibold text-zinc-700">Please specify details:</Label>
          <Input
            id={`${question.id}_other`}
            placeholder={`Detail your choice for ${question.title}...`}
            className="h-10 mt-1.5 bg-white dark:bg-zinc-950 rounded-lg border-zinc-200"
            {...register(`${question.id}_other`, { required: true })}
          />
        </div>
      )}

      {question.helpText && (
        <p className="text-[11px] text-muted-foreground/80 italic mt-0.5 leading-normal">
          💡 {question.helpText}
        </p>
      )}

      {error && (
        <p className="text-xs font-semibold text-red-500 mt-1">
          This field is required.
        </p>
      )}
    </div>
  );
};

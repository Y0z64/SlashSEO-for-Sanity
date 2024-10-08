import React, { useState, useCallback } from "react";
import { Button, TextInput, Stack, Flex, Text, Card, Box, Inline, Tooltip } from '@sanity/ui'
import { useFormValue, set } from "sanity"
import { InfoOutlineIcon, ChevronDownIcon, ChevronUpIcon, SearchIcon, EditIcon, ImageIcon, LinkIcon } from '@sanity/icons'
import { API_KEY } from './config'

// Custom function to convert Portable Text to plain text
const blocksToText = (blocks = []) => {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    console.log('Blocks is not an array or is empty:', blocks);
    return '';
  }
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        console.log('Invalid block:', block);
        return ''
      }
      return block.children.map(child => child.text || '').join('')
    })
    .join('\n\n')
}

// New function to extract H2 headings from Portable Text
const extractH2Headings = (blocks = []) => {
  return blocks
    .filter(block => block.style === 'h2')
    .map(block => block.children.map(child => child.text).join(''))
}

const SEOTool = React.forwardRef((props, ref) => {
  const [keyword, setKeyword] = useState(props.value?.keyword || "");
  const [analysis, setAnalysis] = useState(props.value || null);
  const [error, setError] = useState(null);
  const [isDetailedViewOpen, setIsDetailedViewOpen] = useState(false);

  const body = useFormValue(['body'])
  const title = useFormValue(['title'])
  const slug = useFormValue(['slug', 'current'])

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleButtonClick = useCallback(async () => {
    console.log('SEO Tool button clicked');
    setError(null);
    
    try {
      // Update this URL to your Heroku app's URL
      const response = await fetch('https://checkerapi.slashseo.com/seo-analysis/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          keyword,
          body,
          title,
          slug
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to perform SEO analysis.');
      }

      const analysisResult = await response.json();
      console.log('Analysis Result:', analysisResult);

      setAnalysis(analysisResult);
      props.onChange(set(analysisResult));
    } catch (err) {
      console.error('Error in SEO analysis:', err);
      setError(err.message || 'An error occurred during SEO analysis. Please try again.');
    }
  }, [keyword, body, title, slug, props.onChange]);

  const getOverallScore = (analysis) => {
    const checks = [
      analysis.sufficientWordCount,
      analysis.keywordInTitle,
      analysis.keywordInHeadings,
      analysis.keywordInIntro,
      analysis.keywordInAltText,
      analysis.keywordInSlug,
      analysis.titleLengthOptimal,
      analysis.keywordDensityOptimal
    ];
    return (checks.filter(Boolean).length / checks.length) * 100;
  };

  const getKeywordDensityFeedback = (density, keywordCount, wordCount) => {
    const targetLow = 1.5;
    const targetHigh = 4;
    const currentCount = keywordCount;
    const targetLowCount = Math.ceil((targetLow / 100) * wordCount);
    const targetHighCount = Math.floor((targetHigh / 100) * wordCount);

    if (density < targetLow) {
      const diff = targetLowCount - currentCount;
      return `Keyword density is too low. Add the keyword about ${diff} more time${diff !== 1 ? 's' : ''} to reach the optimal range.`;
    } else if (density > targetHigh) {
      const diff = currentCount - targetHighCount;
      return `Keyword density is too high. Remove the keyword about ${diff} time${diff !== 1 ? 's' : ''} to reach the optimal range.`;
    } else {
      return `Great! Your keyword density is optimal at ${density}% (${keywordCount} times in ${wordCount} words).`;
    }
  };

  const CustomProgressBar = ({ value }) => (
    <Box style={{ width: '100%', height: '12px', backgroundColor: '#e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
      <Box 
        style={{ 
          width: `${value}%`, 
          height: '100%', 
          backgroundColor: value >= 70 ? 'green' : 'orange',
          transition: 'width 0.5s ease-in-out, background-color 0.5s ease-in-out',
          boxShadow: '0 0 5px rgba(0,0,0,0.2) inset'
        }} 
      />
    </Box>
  );

  const ResultItem = ({ label, value, check, feedback, successFeedback, tooltip, icon }) => (
    <Box paddingY={3} borderTop={1} borderColor="gray200">
      <Flex align="center">
        <Box marginRight={3}>{icon}</Box>
        <Flex direction="column" style={{flex: 1}}>
          <Flex align="center">
            <Flex align="center" style={{flex: 1}}>
              <Text size={2} weight="semibold">{label}:</Text>
              {tooltip && (
                <Tooltip content={tooltip} placement="top">
                  <InfoOutlineIcon style={{marginLeft: '5px'}} />
                </Tooltip>
              )}
            </Flex>
            <Inline space={2}>
              <Text size={2}>{value}</Text>
              <Text size={2} style={{color: check ? 'green' : 'red'}}>{check ? '✅' : '❌'}</Text>
            </Inline>
          </Flex>
          <Text size={1} style={{color: check ? 'green' : '#666', marginTop: '4px'}}>
            {check ? successFeedback : feedback}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );

  return (
    <Stack space={4}>
      <Card padding={4} radius={2} shadow={1}>
        <Flex>
          <Box flex={1} marginRight={2}>
            <TextInput
              value={keyword}
              onChange={handleInputChange}
              placeholder="Enter SEO keyword"
              prefix={<SearchIcon />}
            />
          </Box>
          <Button
            text="Analyze SEO"
            tone="primary"
            onClick={handleButtonClick}
            icon={EditIcon}
          />
        </Flex>
      </Card>

      {error && (
        <Text tone="critical">
          {error}{' '}
          {error.includes('API key') && (
            <a href="https://slashseo.com" target="_blank" rel="noopener noreferrer">
              Purchase a license
            </a>
          )}
        </Text>
      )}

      {analysis && (
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={4}>
            <Box>
              <Text weight="bold" size={3} style={{marginBottom: '12px'}}>Overall SEO Score:</Text>
              <CustomProgressBar value={getOverallScore(analysis)} />
              <Text size={2} style={{marginTop: '12px'}}>
                {getOverallScore(analysis).toFixed(0)}% - {getOverallScore(analysis) >= 70 ? 'Good' : 'Needs Improvement'}
              </Text>
            </Box>
            
            <Box>
              <Button
                text={isDetailedViewOpen ? "Hide Detailed Analysis" : "Show Detailed Analysis"}
                tone="primary"
                onClick={() => setIsDetailedViewOpen(!isDetailedViewOpen)}
                icon={isDetailedViewOpen ? ChevronUpIcon : ChevronDownIcon}
              />
              {isDetailedViewOpen && (
                <Box marginTop={4}>
                  <ResultItem 
                    label="Word Count"
                    value={analysis.wordCount}
                    check={analysis.sufficientWordCount}
                    feedback="Your article is less than 300 words. Add some more content."
                    successFeedback="Great! Your article has a good length."
                    tooltip="Aim for at least 300 words for better SEO"
                    icon={<EditIcon />}
                  />
                  <ResultItem 
                    label="Keyword Density"
                    value={`${analysis.keywordDensity}%`}
                    check={analysis.keywordDensityOptimal}
                    feedback={getKeywordDensityFeedback(
                      parseFloat(analysis.keywordDensity), 
                      analysis.keywordCount, 
                      analysis.wordCount
                    )}
                    successFeedback={getKeywordDensityFeedback(
                      parseFloat(analysis.keywordDensity), 
                      analysis.keywordCount, 
                      analysis.wordCount
                    )}
                    tooltip="Optimal keyword density is between 1.5% and 4%"
                    icon={<SearchIcon />}
                  />
                  <ResultItem 
                    label="Keyword in Title"
                    value={analysis.keywordInTitle ? 'Yes' : 'No'}
                    check={analysis.keywordInTitle}
                    feedback="Include your keyword in the title for better SEO."
                    successFeedback="Excellent! Your keyword is in the title."
                    icon={<EditIcon />}
                  />
                  <ResultItem 
                    label="Keyword in Headings"
                    value={analysis.keywordInHeadings ? 'Yes' : 'No'}
                    check={analysis.keywordInHeadings}
                    feedback="Include your keyword in at least one H2, H3, or H4 heading."
                    successFeedback="Good job! Your keyword is in a heading (H2, H3, or H4)."
                    icon={<EditIcon />}
                  />
                  <ResultItem 
                    label="Keyword in Introduction"
                    value={analysis.keywordInIntro ? 'Yes' : 'No'}
                    check={analysis.keywordInIntro}
                    feedback="Include your keyword in the introduction for better SEO."
                    successFeedback="Well done! Your keyword is in the introduction."
                    icon={<EditIcon />}
                  />
                  <ResultItem 
                    label="Keyword in Image Alt Text"
                    value={analysis.keywordInAltText ? 'Yes' : 'No'}
                    check={analysis.keywordInAltText}
                    feedback="Include your keyword in at least one image alt text for better SEO and accessibility."
                    successFeedback="Perfect! Your keyword is in an image alt text."
                    tooltip="Having descriptive alt text that includes your keyword can improve SEO and accessibility."
                    icon={<ImageIcon />}
                  />
                  <ResultItem 
                    label="Keyword in Slug"
                    value={analysis.keywordInSlug ? 'Yes' : 'No'}
                    check={analysis.keywordInSlug}
                    feedback="Include your keyword (or its words) in the URL slug for better SEO."
                    successFeedback="Great! Your keyword (or its words) is in the URL slug."
                    tooltip="The slug should contain all words from your keyword, but they don't need to be consecutive or exact matches."
                    icon={<LinkIcon />}
                  />
                  <ResultItem 
                    label="Title Length"
                    value={`${analysis.titleLength} characters`}
                    check={analysis.titleLengthOptimal}
                    feedback="Optimal title length is between 50-60 characters."
                    successFeedback="Perfect! Your title length is optimal."
                    tooltip="Titles between 50-60 characters are optimal for search engines"
                    icon={<EditIcon />}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        </Card>
      )}
    </Stack>
  );
});

export default SEOTool;
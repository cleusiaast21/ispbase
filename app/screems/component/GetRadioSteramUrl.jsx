import cheerio from 'cheerio';

const getRadioStreamUrl = async (frequency) => {
  try {
    const response = await fetch('https://streema.com/radios/country/Angola');
    const html = await response.text();
    const $ = cheerio.load(html);

    const radioElement = $(`[data-frequency="${frequency}"]`);
    const streamUrl = radioElement.data('streamurl');

    return streamUrl;
  } catch (error) {
    console.error('Erro ao obter a URL da rádio:', error);
    return null;
  }
};

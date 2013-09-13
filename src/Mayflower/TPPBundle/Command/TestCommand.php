<?php

namespace Mayflower\TPPBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class TestCommand extends ContainerAwareCommand
{

    /**
     * Configures the current command.
     */
    protected function configure()
    {
        $this->setName('tpp:test')
            ->setDescription('Runs the tests and therefor setup the database to start with fixture data.');
    }


    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|null
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $kernel = $this->getContainer()->get('kernel');
        $appPath = $kernel->getRootDir();

        $console = $appPath . DIRECTORY_SEPARATOR . 'console';

        if (false === is_file($console)) {
            $output->writeln('Error: The app/console is not existent.');
            return 1;
        }

        $commandChain = array(
            'schema:drop' => array(
                'command' => 'php ' . $console . ' doctrine:schema:drop --env=test --force',
                'write' => false
            ),
            'schema:create' => array(
                'command' => 'php ' . $console . ' doctrine:schema:create --env=test',
                'write' => false
            ),
            /*'fixtures:load' => array(
                'command' => 'php ' . $console . ' doctrine:fixtures:load --env=test -n',
                'write' => false
            ),*/
            'phpunit' => array(
                'command' => 'phpunit -c ' . $appPath,
                'write' => true
            )
        );


        foreach ($commandChain as $commandConfig) {
            $capturedOutput = array();
            $returnStatus = 0;

            $command = $commandConfig['command'];
            $write = $commandConfig['write'];

            exec($command, $capturedOutput, $returnStatus);

            if ($write || OutputInterface::VERBOSITY_VERBOSE <= $output->getVerbosity()) {
                $output->writeln(implode(PHP_EOL, $capturedOutput));
            }

            if ($returnStatus > 0) {
                return 1;
            }
        }

        return 0;

    }


}
